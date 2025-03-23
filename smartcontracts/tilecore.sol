// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}

interface ITileUtils {
    function getDynamicTilePrice() external pure returns (uint256 tilePrice);

    function getHarvestResourceAndAmount(
        uint8 cropType
    ) external pure returns (uint8 resourceType, uint8 amount);

    function plantGrowthCalculator(
        uint8 cropType,
        uint8 fertility,
        uint8 waterlevel
    ) external pure returns (uint8 growth);
}

contract Tile {
    using EnumerableSet for EnumerableSet.UintSet;

    address public admin;
    IERC20 public token;
    address public tileUtilsContract;
    uint256 public pricePerTile = 5000 * 10 ** 18;

    enum CropType {
        None,
        Wheat,
        Corn,
        Potato,
        Carrot
    }

    enum ResourceType {
        None,
        WheatAmount,
        CornAmount,
        PotatoAmount,
        CarrotAmount,
        FoodAmount,
        EnergyAmount,
        FactoryGoodsAmount,
        FertilizerAmount
    }

    enum FactoryType {
        None,
        FoodFactory,
        EnergyFactory,
        Bakery,
        JuiceFactory,
        BioFuelFactory
    }

    struct TileData {
        uint32 id;
        address owner;
        bool isBeingUsed;
        bool isCrop;
        CropType cropType;
        FactoryType factoryType;
        uint8 fertility;
        uint8 waterLevel;
        uint8 growthStage;
        bool forSale;
        uint256 price;
    }

    struct UserData {
        address userAddress;
        uint32 totalTilesOwned;
        uint32 tilesUnderUse;
        uint32 userExperience;
        bool exists;
        mapping(uint8 => uint64) inventory;
    }

    mapping(uint32 => TileData) public tiles;
    mapping(address => UserData) public users;
    mapping(uint32 => bool) public tileExists;
    mapping(address => EnumerableSet.UintSet) private tilesOfUser;

    EnumerableSet.UintSet private listedTilesForSale;


    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call");
        _;
    }

    constructor(address _token, address _tileUtilsContract) {
        admin = msg.sender;
        token = IERC20(_token);
        tileUtilsContract = _tileUtilsContract;
    }
    function updateTileUtilsContract(address utilscontract) external onlyAdmin {
        tileUtilsContract = utilscontract;
    }
    
    // -----------------------------------------------------

    // tile functions

    // -----------------------------------------------------

    event TilePurchased(address indexed buyer, uint64 tileId);

    function buyNewTile(uint32 tileId) external {
        require(!tileExists[tileId], "Tile already sold");
        require(
            token.transferFrom(msg.sender, address(this), pricePerTile),
            "Token transfer fail"
        );

        TileData storage tile = tiles[tileId];
        tile.id = tileId;
        tile.owner = msg.sender;
        tile.cropType = CropType.None;
        tile.factoryType = FactoryType.None;
        tileExists[tileId] = true;

        UserData storage user = users[msg.sender];
        user.userAddress = msg.sender;
        user.totalTilesOwned += 1;
        user.userExperience += 20;
        user.exists = true;
        tilesOfUser[msg.sender].add(tileId);

        emit TilePurchased(msg.sender, tileId);
    }

    modifier onlyTileOwner(uint32 tileId) {
        require(
            tiles[tileId].owner == msg.sender,
            "Not the owner of this tile"
        );
        _;
    }

    event TileListed(uint32 tileId);

    function listTileForSale(
        uint32 tileId,
        uint256 price
    ) external onlyTileOwner(tileId) {
        require(tileExists[tileId], "Tile does not exist");
        require(price > 0, "Price must be > 0");
        TileData storage tile = tiles[tileId];
        require(!tile.forSale && !tile.isBeingUsed, "Tile cannot be listed");

        tile.forSale = true;
        tile.price = price;
        listedTilesForSale.add(tileId);
        emit TileListed(tileId);
    }

    event ResaleTileBought(
        address indexed seller,
        address indexed buyer,
        uint32 tileId
    );

    function buyListedTile(uint32 tileId) external payable {
        TileData storage tile = tiles[tileId];
        address seller = tile.owner;
        require(
            token.transferFrom(msg.sender, seller, tile.price),
            "Token transfer failed"
        );

        tilesOfUser[seller].remove(tileId);
        tile.owner = msg.sender;
        tile.forSale = false;
        tile.price = 0;

        UserData storage sellerData = users[seller];
        sellerData.totalTilesOwned -= 1;
        sellerData.userExperience += 90;

        UserData storage buyerData = users[msg.sender];
        buyerData.totalTilesOwned += 1;
        buyerData.userExperience += 90;

        tilesOfUser[msg.sender].add(tileId);

        listedTilesForSale.remove(tileId);

        emit ResaleTileBought(seller, msg.sender, tileId);
    }

    // -----------------------------------------------------

    // farming functions

    // -----------------------------------------------------

    uint256 public cropPrice = 50 * 10 * 18;

    function plantCrop(
        uint32 tileId,
        CropType crop
    ) external onlyTileOwner(tileId) {
        TileData storage tile = tiles[tileId];
        require(!tile.isBeingUsed, "Already cooking something");
        require(
            token.transferFrom(msg.sender, address(this), cropPrice),
            "Token transfer failed"
        );
        tile.isBeingUsed = true;
        tile.cropType = crop;
        tile.isCrop = true;
        users[msg.sender].tilesUnderUse += 1;
        users[msg.sender].userExperience += 10;
    }

    function harvestCrop(uint32 tileId) external onlyTileOwner(tileId) {
        TileData storage tile = tiles[tileId];
        require(tile.isBeingUsed, "No crop is planted");
        require(tile.growthStage == 100, "Cannot harvest now");
        UserData storage user = users[msg.sender];
        user.tilesUnderUse -= 1;

        (uint8 harvestedResource, uint8 amount) = ITileUtils(tileUtilsContract)
            .getHarvestResourceAndAmount(uint8(tile.cropType));

        if (harvestedResource != uint8(ResourceType.None)) {
            user.inventory[harvestedResource] += amount;
        }

        tile.isBeingUsed = false;
        tile.cropType = CropType.None;
        tile.isCrop = false;
        tile.fertility = 0;
        tile.waterLevel = 0;
        tile.growthStage = 0;

        user.userExperience += 20;
    }

    mapping(address => uint256) public lastWateredTime;

    function waterCrop(uint32 tileId) external onlyTileOwner(tileId) {
        require(tiles[tileId].isBeingUsed, "No crop here");
        require(
            block.timestamp >= lastWateredTime[msg.sender] + 1 days,
            "once in 24 hours"
        );
        tiles[tileId].waterLevel += 12;
        users[msg.sender].userExperience += 5;
        lastWateredTime[msg.sender] = block.timestamp;
        uint8 growth = ITileUtils(tileUtilsContract).plantGrowthCalculator(
            uint8(tiles[tileId].cropType),
            tiles[tileId].fertility,
            tiles[tileId].waterLevel
        );
        tiles[tileId].growthStage += growth;
        if ((tiles[tileId].growthStage) >= 100) {
            tiles[tileId].growthStage = 100;
        }
    }

    function fertilizeCrop(uint32 tileId) external onlyTileOwner(tileId) {
        require(tiles[tileId].isBeingUsed, "No Crop here");
        require(tiles[tileId].fertility <= 100, "The land has max fertility");
        UserData storage user = users[msg.sender];
        require(user.inventory[6] >= 100, "Purchase fertilizer");
        user.inventory[6] -= 100;
        TileData storage tile = tiles[tileId];
        tile.fertility = 100;
        user.userExperience += 5;
        uint8 growth = ITileUtils(tileUtilsContract).plantGrowthCalculator(
            uint8(tiles[tileId].cropType),
            tiles[tileId].fertility,
            tiles[tileId].waterLevel
        );
        tiles[tileId].growthStage += growth;
        if ((tiles[tileId].growthStage) >= 100) {
            tiles[tileId].growthStage = 100;
        }
    }

    // -----------------------------------------------------

    // factory functions

    // -----------------------------------------------------

    uint256 public factoryPrice = 500 * 10 ** 18;

    function buildFactory(
        uint32 tileId,
        FactoryType factory
    ) external onlyTileOwner(tileId) {
        TileData storage tile = tiles[tileId];
        require(!tile.isBeingUsed, "Already cooking something");
        require(
            token.transferFrom(msg.sender, address(this), factoryPrice),
            "Token transfer failed"
        );
        tile.isBeingUsed = true;
        tile.isCrop = false;
        tile.factoryType = factory;
    }

    modifier onlyTileUtils() {
        require(msg.sender == tileUtilsContract, "Only TileUtils contract can call this function");
        _;
    }

    function updateInventory(
        address user,
        ResourceType resource,
        uint8 amount,
        bool increase
    ) external onlyTileUtils {
        uint8 resourcetype = uint8(resource);
        if (increase) {
            users[user].inventory[resourcetype] += amount;
        } else {
            users[user].inventory[resourcetype] -= amount;
        }
    }


    // -----------------------------------------------------

    // Marketplace functions

    // -----------------------------------------------------

    struct MarketListing {
        address seller;
        ResourceType resourceType;
        uint32 amount;
        uint256 pricePerUnit;
        bool isActive;
    }

    mapping(uint128 => MarketListing) public marketListings;
    uint128 public nextListingId = 1;

    event ListedResourceForSale(
        uint128 listingId,
        address seller,
        ResourceType resourceType,
        uint32 amount,
        uint256 pricePerUnit
    );

    function listResourceForSale(
        ResourceType resourceType,
        uint32 amount,
        uint256 pricePerUnit
    ) external {
        require(amount > 0, "Amount must be greater than zero");
        require(
            users[msg.sender].inventory[uint8(resourceType)] >= amount,
            "You don't have enough resources"
        );

        users[msg.sender].inventory[uint8(resourceType)] -= amount;

        marketListings[nextListingId] = MarketListing({
            seller: msg.sender,
            resourceType: resourceType,
            amount: amount,
            pricePerUnit: pricePerUnit,
            isActive: true
        });

        emit ListedResourceForSale(
            nextListingId,
            msg.sender,
            resourceType,
            amount,
            pricePerUnit
        );
        nextListingId++;
    }

    event ResourcePurchaseMade(
        uint128 listingId,
        address buyer,
        uint256 amount
    );

    function buyListedResource(uint128 listingId, uint256 buyAmount) external {
        MarketListing storage listing = marketListings[listingId];
        require(listing.isActive, "Listing no more active");
        require(
            buyAmount > 0 && buyAmount <= listing.amount,
            "Invalid buy amount"
        );

        uint256 totalCost = listing.pricePerUnit * buyAmount;
        require(
            token.transferFrom(msg.sender, listing.seller, totalCost),
            "Token transfer fail"
        );

        users[msg.sender].inventory[uint8(listing.resourceType)] += uint64(
            buyAmount
        );

        listing.amount -= uint32(buyAmount);

        if (listing.amount == 0) {
            listing.isActive = false;
        }
        emit ResourcePurchaseMade(listingId, msg.sender, buyAmount);
    }

    // -----------------------------------------------------

    // admin

    // -----------------------------------------------------

    function withdrawTokens(uint256 amount) external onlyAdmin {
        require(token.balanceOf(address(this)) >= amount, "Not enough balance");
        token.transfer(admin, amount);
    }

    // -----------------------------------------------------

    // frontend helpers

    // -----------------------------------------------------

    function getListedTiles() external view returns (uint256[] memory) {
        return listedTilesForSale.values();
    }

    function getTileData(
        uint32 tileId
    )
        external
        view
        returns (
            uint32 id,
            address owner,
            bool isBeingUsed,
            bool isCrop,
            CropType cropType,
            FactoryType factoryType,
            uint8 fertility,
            uint8 waterLevel,
            uint8 growthStage,
            bool forSale,
            uint256 price
        )
    {
        require(tileExists[tileId], "Tile does not exist");
        TileData storage tile = tiles[tileId];

        return (
            tile.id,
            tile.owner,
            tile.isBeingUsed,
            tile.isCrop,
            tile.cropType,
            tile.factoryType,
            tile.fertility,
            tile.waterLevel,
            tile.growthStage,
            tile.forSale,
            tile.price
        );
    }

    function getUserData(
        address user
    )
        external
        view
        returns (
            address userAddress,
            uint32 totalTilesOwned,
            uint32 tilesUnderUse,
            uint32 userExperience,
            bool exists
        )
    {
        require(users[user].exists, "User does not exist");

        UserData storage userData = users[user];

        return (
            userData.userAddress,
            userData.totalTilesOwned,
            userData.tilesUnderUse,
            userData.userExperience,
            userData.exists
        );
    }

    

    function getUserTiles(
        address user
    ) external view returns (uint256[] memory) {
        return tilesOfUser[user].values();
    }

    function getAllMarketListings()
        external
        view
        returns (
            uint128[] memory listingIds,
            address[] memory sellers,
            ResourceType[] memory resourceTypes,
            uint32[] memory amounts,
            uint256[] memory pricePerUnits
        )
    {
        uint128 totalListings = nextListingId;
        uint128 count = 0;

        // First, count active listings
        for (uint128 i = 1; i < totalListings; i++) {
            if (marketListings[i].isActive) {
                count++;
            }
        }

        // Create arrays with exact size
        listingIds = new uint128[](count);
        sellers = new address[](count);
        resourceTypes = new ResourceType[](count);
        amounts = new uint32[](count);
        pricePerUnits = new uint256[](count);

        uint128 index = 0;
        for (uint128 i = 1; i < totalListings; i++) {
            if (marketListings[i].isActive) {
                listingIds[index] = i;
                sellers[index] = marketListings[i].seller;
                resourceTypes[index] = marketListings[i].resourceType;
                amounts[index] = marketListings[i].amount;
                pricePerUnits[index] = marketListings[i].pricePerUnit;
                index++;
            }
        }
    }

    function getUserInventory(
        address user,
        ResourceType resource
    ) external view returns (uint256) {
        return users[user].inventory[uint8(resource)];
    }


    function getUserAllInventory(
        address user
    ) external view returns (uint64[] memory) {
        uint8 totalResources = uint8(type(ResourceType).max) + 1; // Number of resource types
        uint64[] memory inventoryData = new uint64[](totalResources);

        for (uint8 i = 0; i < totalResources; i++) {
            inventoryData[i] = users[user].inventory[i];
        }

        return inventoryData;
    }


    function doesTileExist(uint32 tileId) external view returns (bool) {
        return tileExists[tileId];
    }



}
