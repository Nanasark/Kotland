// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IEvolvableNFT {
    function evolveNFT(uint256 tokenId) external;
}

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);

    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract Land {
    address public admin;
    IERC20 public token; // Custom ERC20 token for payments
    uint256 public pricePerTile = 50 * 10 ** 18; // 50 tokens per tile (assuming 18 decimals)

    enum CropType {
        None,
        Wheat,
        Corn,
        Potato,
        Carrot
    }
    enum FactoryType {
        None,
        Food,
        Energy
    }

    struct TileData {
        uint256 id;
        address owner;
        bool isBeingUsed;
        address nftBeingUsed;
        uint256 nftIdBeingStaked;
        bool forSale;
        CropType cropType;
        FactoryType factoryType;
        uint256 fertility;
        uint256 waterLevel;
        uint256 sunlight;
        uint256 growthStage;
    }

    struct UserData {
        address userAddress;
        uint256 totalTilesOwned;
        uint256 tilesUnderUse;
        uint256 userExperience;
        uint256 nftsBought;
        uint256 nftsSold;
        bool exists;
        uint256[] ownedTileIds;
        uint256 totalRewardsEarned;
        uint256 currentRewards;
    }

    mapping(uint256 => TileData) public tiles;
    mapping(address => UserData) public users;
    mapping(uint256 => bool) public tileExists;
    mapping(address => uint256[]) public tilesOfUser;

    uint256[] public listedTilesForSellingId;
    uint256 public totalReBuys;
    uint256 public totalResellTile;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call");
        _;
    }

    constructor(address _token) {
        admin = msg.sender;
        token = IERC20(_token);
    }

    event TilePurchased(address indexed buyer, uint256 tileId);

    function buyNewTile(uint256 tileId) external {
        require(!tileExists[tileId], "Tile already sold");
        require(
            token.transferFrom(msg.sender, address(this), pricePerTile),
            "Token transfer failed"
        );

        tiles[tileId] = TileData({
            id: tileId,
            owner: msg.sender,
            isBeingUsed: false,
            nftBeingUsed: address(0),
            nftIdBeingStaked: 0,
            forSale: false,
            cropType: CropType.None,
            factoryType: FactoryType.None,
            fertility: 0,
            waterLevel: 0,
            sunlight: 0,
            growthStage: 0
        });

        tileExists[tileId] = true;
        tilesOfUser[msg.sender].push(tileId);

        UserData storage user = users[msg.sender];
        user.userAddress = msg.sender;
        user.totalTilesOwned += 1;
        user.userExperience += 100;
        user.exists = true;
        user.ownedTileIds.push(tileId);

        emit TilePurchased(msg.sender, tileId);
    }

    modifier onlyTileOwner(uint256 tileId) {
        require(
            tiles[tileId].owner == msg.sender,
            "Not the owner of this tile"
        );
        _;
    }

    event TileListed(uint256 tileId);

    function listTileForSale(uint256 tileId) external onlyTileOwner(tileId) {
        require(tileExists[tileId], "Tile doesnt exist");
        TileData storage tile = tiles[tileId];
        require(!tile.forSale, "Property already listed");

        tile.forSale = true;
        listedTilesForSellingId.push(tileId);
        tile.isBeingUsed = false;
        tile.nftBeingUsed = address(0);
        tile.nftIdBeingStaked = 0;

        emit TileListed(tileId);
    }

    event ReSaleTileBought(
        address indexed seller,
        address indexed buyer,
        uint256 tileId
    );

    function buyListedTile(uint256 tileId) external payable {
        require(tileExists[tileId], "Tile is not yet registered");
        TileData storage tile = tiles[tileId];
        require(tile.forSale, "Property is not for sale");

        address seller = tile.owner;
        require(
            token.transferFrom(msg.sender, seller, pricePerTile),
            "Token transfer failed"
        );

        tile.owner = msg.sender;
        tile.forSale = false;

        updateUserAfterSale(seller, msg.sender, tileId);
        removeListedTile(tileId);
    }

    function updateUserAfterSale(
        address seller,
        address buyer,
        uint256 tileId
    ) internal {
        // seller data update
        UserData storage sellerUser = users[seller];
        sellerUser.totalTilesOwned -= 1;
        removeTileFromUser(seller, tileId);

        // update buyer data
        UserData storage buyerUser = users[buyer];
        buyerUser.totalTilesOwned += 1;
        buyerUser.userExperience += 200;
        buyerUser.ownedTileIds.push(tileId);
    }

    function removeTileFromUser(address user, uint256 tileId) internal {
        uint256[] storage TilesList = users[user].ownedTileIds;
        for (uint256 i = 0; i < TilesList.length; i++) {
            if (TilesList[i] == tileId) {
                TilesList[i] = TilesList[TilesList.length - 1];
                TilesList.pop();
                break;
            }
        }
    }

    function removeListedTile(uint256 tileId) internal {
        for (uint256 i = 0; i < listedTilesForSellingId.length; i++) {
            if (listedTilesForSellingId[i] == tileId) {
                listedTilesForSellingId[i] = listedTilesForSellingId[
                    listedTilesForSellingId.length - 1
                ];
                listedTilesForSellingId.pop();
                break;
            }
        }
    }

    // -----------------------------------------------------

    // farming functions

    // -----------------------------------------------------

    function plantCrop(
        uint256 tileId,
        CropType crop
    ) external onlyTileOwner(tileId) {
        TileData storage tile = tiles[tileId];
        require(!tile.isBeingUsed, "Tile is already preparing something");

        tile.isBeingUsed = true;
        tile.cropType = crop;
        tile.growthStage = 0;
    }

    function harvestCrop(uint256 tileId) external onlyTileOwner(tileId) {
        require(tiles[tileId].isBeingUsed, "No crop planted");
        require(
            tiles[tileId].growthStage == 100,
            "You cannot still harvest it"
        );

        UserData storage user = users[msg.sender];
        user.tilesUnderUse -= 1;

        TileData storage tile = tiles[tileId];
        user.currentRewards =
            user.currentRewards +
            ((tile.fertility + tile.waterLevel) % 20);
        user.totalRewardsEarned += (tile.fertility + tile.waterLevel) % 20;
        tile.isBeingUsed = false;
        tile.cropType = CropType.None;
        tile.fertility = 0;
        tile.waterLevel = 0;
        tile.growthStage = 0;
    }

    uint256 public waterAndFertilizerPrice = 1 * 10 ** 18;
    mapping(address => uint256) public lastWateredTime;

    function waterCrop(uint256 tileId) external onlyTileOwner(tileId) {
        require(tiles[tileId].isBeingUsed, "No Crop Planted");
        require(
            block.timestamp >= lastWateredTime[msg.sender] + 1 days,
            "Can only water once every 24 hours"
        );
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                waterAndFertilizerPrice
            ),
            "Token transfer failed"
        );
        tiles[tileId].waterLevel += 5;
        users[msg.sender].userExperience += 5;
        plantGrowthCalculator(tileId);
        if (tiles[tileId].growthStage >= 100) {
            tiles[tileId].growthStage = 100;
        }
    }

    mapping(address => uint256) public lastFertilizedTime;

    function fertilizeCrop(uint256 tileId) external onlyTileOwner(tileId) {
        require(tiles[tileId].isBeingUsed, "No Crop Planted");
        require(
            block.timestamp >= lastFertilizedTime[msg.sender] + 1 days,
            "Can only fertilize once every 24 hours"
        );
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                waterAndFertilizerPrice
            ),
            "Token transfer failed"
        );
        tiles[tileId].fertility += 5;
        users[msg.sender].userExperience += 5;
        plantGrowthCalculator(tileId);
        if (tiles[tileId].growthStage >= 100) {
            tiles[tileId].growthStage = 100;
        }
    }

    string[4] public seasons = ["winter", "spring", "summer", "monsoon"];
    uint8 public currentSeason = 0;

    function plantGrowthCalculator(uint256 tileId) internal {
        uint256 growthRate = 0;
        TileData storage tile = tiles[tileId];

        if (tile.cropType == CropType.Wheat) {
            growthRate = (currentSeason == 1)
                ? 15
                : ((currentSeason == 2 || currentSeason == 3) ? 10 : 3);
        } else if (tile.cropType == CropType.Corn) {
            growthRate = (currentSeason == 2)
                ? 20
                : (currentSeason == 1 ? 10 : 2); // Best: Summer
        } else if (tile.cropType == CropType.Potato) {
            growthRate = (currentSeason == 0)
                ? 12
                : (currentSeason == 1 ? 7 : 3); // Best: Winter
        } else if (tile.cropType == CropType.Carrot) {
            growthRate = (currentSeason == 0)
                ? 15
                : ((currentSeason == 1 || currentSeason == 3) ? 8 : 2); // Best: Winter
        } else {
            growthRate = 0; // Default case
        }

        tile.growthStage =
            tile.growthStage +
            ((tile.waterLevel + tile.fertility) % growthRate);
    }

    // frontend helper

    function getUserData(
        address user
    )
        external
        view
        returns (
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            bool,
            uint256[] memory,
            uint256,
            uint256
        )
    {
        UserData storage userData = users[user];
        return (
            userData.userAddress,
            userData.totalTilesOwned,
            userData.tilesUnderUse,
            userData.userExperience,
            userData.nftsBought,
            userData.nftsSold,
            userData.exists,
            userData.ownedTileIds,
            userData.totalRewardsEarned,
            userData.currentRewards
        );
    }



    function getTileData(
        uint256 tileId
    )
        external
        view
        returns (
            uint256,
            address,
            bool,
            address,
            uint256,
            bool,
            CropType,
            FactoryType,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        TileData storage tile = tiles[tileId];
        return (
            tile.id,
            tile.owner,
            tile.isBeingUsed,
            tile.nftBeingUsed,
            tile.nftIdBeingStaked,
            tile.forSale,
            tile.cropType,
            tile.factoryType,
            tile.fertility,
            tile.waterLevel,
            tile.sunlight,
            tile.growthStage
        );
    }

    function getListedTilesForSale() external view returns (uint256[] memory) {
        return listedTilesForSellingId;
    }


    function getTokenAddress() external view returns (address) {
        return address(token);
    }

    function getTilePrice() external view returns (uint256) {
        return pricePerTile;
    }

    function getWaterAndFertilizerPrice() external view returns (uint256) {
        return waterAndFertilizerPrice;
    }

    function getLastActionTimes(address user) external view returns (uint256 lastWatered, uint256 lastFertilized) {
        return (lastWateredTime[user], lastFertilizedTime[user]);
    }


    // user withdraw

    function withdrawReward(uint256 amount) external {
        UserData storage user = users[msg.sender];
        require(user.exists, "User does not exist");
        require(user.currentRewards >= amount, "Not enough rewards to withdraw");

        user.currentRewards -= amount;
        token.transferFrom(address(this), msg.sender, amount);
        
    }



    // admin


    function withdrawTokens(uint256 amount) external onlyAdmin {
        require(token.balanceOf(address(this)) >= amount, "Not enough tokens in contract");
        token.transfer(admin, amount);
    }





    








}
