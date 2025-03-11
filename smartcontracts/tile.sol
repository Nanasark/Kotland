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

    enum ResourceType{ None, WheatAmount, CornAmount, PotatoAmount, CarrotAmount, FoodAmount, EnergyAmount, FactoryGoodsAmount, FertilizerAmount}
    enum FactoryType {
        None,
        FoodFactory,
        EnergyFactory,
        Bakery,
        JuiceFactory,
        BioFuelFactory
    }

    struct TileData {
        uint256 id;
        address owner;
        bool isBeingUsed;
        bool forSale;
        bool isCrop;
        bool isFactory;
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
        bool exists;
        uint256[] ownedTileIds;
        uint256 totalRewardsEarned;
        uint256 currentRewards;     
        mapping(ResourceType => uint256) inventory;
    }

    mapping(uint256 => TileData) public tiles;
    mapping(address => UserData) public users;
    mapping(uint256 => bool) public tileExists;
    mapping(address => uint256[]) public tilesOfUser;

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

        TileData storage tile = tiles[tileId];
        tile.id = tileId;
        tile.owner = msg.sender;
        tile.isBeingUsed = false;
        tile.forSale = false;
        tile.cropType = CropType.None;
        tile.factoryType = FactoryType.None;
        tile.fertility = 0;
        tile.waterLevel = 0;
        tile.growthStage = 0;
        tile.isCrop = false;
        tile.isFactory = false;


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
    uint256[] public listedTilesForSellingId;
    mapping (uint256 => uint256) public tilePrices;
    function listTileForSale(uint256 tileId, uint256 price) external onlyTileOwner(tileId) {
        require(tileExists[tileId], "Tile doesnt exist");
        require(price > 0, "Price must be greater than 0");
        TileData storage tile = tiles[tileId];
        require(!tile.forSale, "Tile already listed");
        require(!tile.isBeingUsed, "Tile is still being used");
        tile.forSale = true;
        listedTilesForSellingId.push(tileId);
        tile.isBeingUsed = false;      
        tilePrices[tileId] = price;

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
            token.transferFrom(msg.sender, seller, tilePrices[tileId]),
            "Token transfer failed"
        );

        tile.owner = msg.sender;
        tile.forSale = false;
        delete tilePrices[tileId];

        updateUserAfterSale(seller, msg.sender, tileId);
        removeListedTile(tileId);

        emit ReSaleTileBought(seller, msg.sender, tileId);
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

    uint256 public cropPrice = 5 * 10 ** 18;
    function plantCrop(
        uint256 tileId,
        CropType crop
    ) external onlyTileOwner(tileId) payable {
        TileData storage tile = tiles[tileId];
        require(!tile.isBeingUsed, "Tile is already preparing something");
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                cropPrice
            ),
            "Token transfer failed"
        );
        tile.isBeingUsed = true;
        tile.cropType = crop;
        tile.growthStage = 0;
        tile.isCrop = true;
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
        if(tile.cropType == CropType.Wheat) {
            user.inventory[ResourceType.WheatAmount] += 100;
        } else if (tile.cropType == CropType.Corn) {
            user.inventory[ResourceType.CornAmount] += 100;
        } else if (tile.cropType == CropType.Potato) {
            user.inventory[ResourceType.PotatoAmount] += 100;
        } else if (tile.cropType == CropType.Carrot) {
            user.inventory[ResourceType.CarrotAmount] += 100;
        }

        tile.isBeingUsed = false;
        tile.cropType = CropType.None;
        tile.isCrop = false;

        tile.fertility = 0;
        tile.waterLevel = 0;
        tile.growthStage = 0;

    }

    mapping(address => uint256) public lastWateredTime;

    function waterCrop(uint256 tileId) external onlyTileOwner(tileId) {
        require(tiles[tileId].isBeingUsed, "No Crop Planted");
        require(
            block.timestamp >= lastWateredTime[msg.sender] + 1 days,
            "Can only water once every 24 hours"
        );
        
        tiles[tileId].waterLevel += 10;
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
        require(tiles[tileId].fertility <= 100, "The land has maximum fertilizer composition.");

        UserData storage user = users[msg.sender];
        TileData storage tile = tiles[tileId];
        require(user.inventory[ResourceType.FertilizerAmount] >= 100, "Please Buy some fertilizer first");
        user.inventory[ResourceType.FertilizerAmount] -= 100;
        tile.fertility = 100;
        user.userExperience += 5;
        plantGrowthCalculator(tileId);
        if (tile.growthStage >= 100) {
            tile.growthStage = 100;
        }
        lastFertilizedTime[msg.sender] = block.timestamp;
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



    // -----------------------------------------------------

    // Factory functions

    // -----------------------------------------------------


    uint256 public factoryPrice = 100 * 10 ** 18;
    function buildFactory(uint256 tileId, FactoryType factory) external payable onlyTileOwner(tileId) {
        TileData storage tile = tiles[tileId];
        require(!tile.isBeingUsed, "Tile is already cooking something");
        require(token.transferFrom(msg.sender, address(this), factoryPrice));

        tile.isBeingUsed = true;
        tile.isFactory = true;
        tile.factoryType = factory;
    }

    function produceFromFactory(uint256 tileId) external onlyTileOwner(tileId) {
        TileData storage tile = tiles[tileId];
        require(tile.isBeingUsed, "Nothing there");
        require(tile.isFactory, "Not a factory tile");

        UserData storage user = users[msg.sender];
        require(user.inventory[ResourceType.EnergyAmount] > 10, "You dont have enough energy to power your factory");
        user.inventory[ResourceType.EnergyAmount] -= 10;

        if(tile.factoryType == FactoryType.FoodFactory) {
            require(
                user.inventory[ResourceType.WheatAmount] >= 50 ||
                user.inventory[ResourceType.CornAmount] >= 50 ||
                user.inventory[ResourceType.PotatoAmount] >= 50 ||
                user.inventory[ResourceType.CarrotAmount] >= 50,
                "You dont have enough resources to produce food. Go to Marketplace to buy some."
            );

            if (user.inventory[ResourceType.WheatAmount] >= 50) {
                user.inventory[ResourceType.WheatAmount] -= 50;
            } else if (user.inventory[ResourceType.CornAmount] >= 50) {
                user.inventory[ResourceType.CornAmount] -= 50;
            } else if (user.inventory[ResourceType.PotatoAmount] >= 50) {
                user.inventory[ResourceType.PotatoAmount] -= 50;
            } else if (user.inventory[ResourceType.CarrotAmount] >= 50) {
                user.inventory[ResourceType.CarrotAmount] -= 50;
            }

            user.inventory[ResourceType.FoodAmount] += 10;

        } else if (tile.factoryType == FactoryType.EnergyFactory) {
            require(user.inventory[ResourceType.FoodAmount] >= 20, "Your workers arent well fed");
            require(user.inventory[ResourceType.FactoryGoodsAmount] >= 10, "Not enough fuel to run the system");

            user.inventory[ResourceType.FoodAmount] -= 20;
            user.inventory[ResourceType.FactoryGoodsAmount] -= 10;
            user.inventory[ResourceType.EnergyAmount] += 40;

        } else if (tile.factoryType == FactoryType.Bakery) {
            require(
                user.inventory[ResourceType.WheatAmount] >= 30 &&
                user.inventory[ResourceType.FoodAmount] >= 10,
                "Not enough wheat and food"
            );

            user.inventory[ResourceType.WheatAmount] -= 30;
            user.inventory[ResourceType.FoodAmount] -= 10;
            user.inventory[ResourceType.FactoryGoodsAmount] += 10;
        
        } else if (tile.factoryType == FactoryType.JuiceFactory) {
            require(
                user.inventory[ResourceType.CornAmount] >= 20 &&
                user.inventory[ResourceType.CarrotAmount] >= 20,
                "Not enough Corn or Carrot"
            );

            user.inventory[ResourceType.CornAmount] -= 20;
            user.inventory[ResourceType.CarrotAmount] -= 20;
            user.inventory[ResourceType.FactoryGoodsAmount] += 10;
        
        } else if (tile.factoryType == FactoryType.BioFuelFactory) {
            require(
                user.inventory[ResourceType.CornAmount] >= 25 && 
                user.inventory[ResourceType.FactoryGoodsAmount] > 5,
                "Not enough Corn or Factory Goods"
            );
            user.inventory[ResourceType.CornAmount] -= 25;
            user.inventory[ResourceType.FactoryGoodsAmount] -= 5;
            user.inventory[ResourceType.EnergyAmount] += 10;

        } else {
            revert("Invalid Factory Type");
        } 

    }
    // -----------------------------------------------------

    // Marketplace functions

    // -----------------------------------------------------


    struct MarketListing {
        address seller;
        ResourceType resourceType;
        uint256 amount;
        uint256 pricePerUnit;
        bool isActive;
    } 

    mapping(uint256 => MarketListing) public marketListings;
    uint256 public nextListingId = 1;


    event ListedResourceForSale(uint256 listingId, address seller, ResourceType resourceType, uint256 amount, uint256 pricePerUnit);
    function listResourceForSale(ResourceType resourceType, uint256 amount, uint256 pricePerUnit) external {
        require(amount > 0, "Amount must be greater than zero");
        require(pricePerUnit > 0, "Price must be greater than zero");
        require(users[msg.sender].inventory[resourceType] >= amount, "You donot have enough resources to sell");

        users[msg.sender].inventory[resourceType] -= amount;

        marketListings[nextListingId] = MarketListing({
            seller: msg.sender,
            resourceType: resourceType,
            amount: amount,
            pricePerUnit: pricePerUnit,
            isActive: true
        });


        emit ListedResourceForSale(nextListingId, msg.sender, resourceType, amount, pricePerUnit);
        nextListingId++;
    }

    event ResourcePurchaseMade(uint256 listingId, address buyer, uint256 amount);
    function buyListedResource(uint256 listingId, uint256 buyAmount) external payable {
        MarketListing storage listing = marketListings[listingId];
        require(listing.isActive, "Listing is no more active");
        require(buyAmount > 0 && buyAmount <= listing.amount, "Invalid amount provided");

        uint256 totalCost = listing.pricePerUnit * buyAmount;
        require(
            token.transferFrom(msg.sender, listing.seller, totalCost),
            "Token transfer failed"
        );

        users[msg.sender].inventory[listing.resourceType] += buyAmount;
        listing.amount -= buyAmount;

        if(listing.amount == 0) {
            listing.isActive = false;
        }
        emit ResourcePurchaseMade(listingId, msg.sender, buyAmount);
    }    
    // frontend helper
   
    function getListedTilesForSale() external view returns (uint256[] memory) {
        return listedTilesForSellingId;
    }

    function getTokenAddress() external view returns (address) {
        return address(token);
    }

    function getTilePrice() external view returns (uint256) {
        return pricePerTile;
    }


    function getLastActionTimes(address user) external view returns (uint256 lastWatered, uint256 lastFertilized) {
        return (lastWateredTime[user], lastFertilizedTime[user]);
    }

    function getActiveResourcesListings() external view returns (MarketListing[] memory) {
        uint256 count = 0;

        for (uint256 i = 1; i < nextListingId; i++) {
            if (marketListings[i].isActive) {
                count++;
            }
        }

        MarketListing[] memory activeListings = new MarketListing[](count);
        uint256 index = 0;
        for(uint256 i = 1; i < nextListingId; i++) {
            if(marketListings[i].isActive) {
                activeListings[index] = marketListings[i];
                index++;
            }
        }
        return activeListings;
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
