// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyMarket {
    address public admin;

    uint256 public pricePerSqM = 1 ether;
    uint256 public totalProperties = 0;
    uint256[] public listedPropertyIds;
    uint256 public totalSqMSold;


    struct Property {
        uint256 id;
        address owner;
        uint256 sizeSqM;
        bool forSale;
        uint256 salePrice;
    } 

    struct User {
        address userAddress;
        uint256 totalPropertiesOwned;
        uint256 totalSqMOwned;
        uint256 totalSpent;
        uint256 totalEarned;
        uint256[] ownedPropertyIds;
        uint256 totalResaleCount;
        uint256 landUsed;
        bool exists;
    }

    mapping(uint256 => Property) public properties; //propertyId => Property
    mapping(address => uint256[]) public userProperties;
    mapping(address => User) public users; //address => User
    mapping(address => bool) public approvedUpdaters; //address => bool
    mapping(uint256 => bool) public propertyExists; // propertyId => true/false

    uint256 public totalBuys;
    uint256 public totalSells;
    uint256[] public recentActions; //1 for buy, 0 for sell - tracks last 100 actions

    uint256 constant MAX_RECENT_ACTIONS = 100;
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call");
        _;
    }

    modifier onlyApprovedUpdater() {
        require(approvedUpdaters[msg.sender], "Not approved to update landUsed");
        _;
    }


    event PropertyPurchased(address indexed buyer, uint256 propertyId, uint256 sizeSqM, uint256 price);
    event PropertyListed(uint256 propertyId, uint256 salePrice);
    event PropertySold(address indexed seller, address indexed buyer, uint256 propertyId, uint256 price);
    event LandUsedUpdated(address indexed user, uint256 landUsed);


    constructor() {
        admin = msg.sender;
    }

    function log2(uint256 x) internal pure returns (uint256) {
        uint256 result = 0;
        while (x > 1) {
            x = x >> 1;
            result++;
        } 
        return result;
    }

    function calculateDynamicPricePerSqM() public view returns (uint256) {
        uint256 basePrice = pricePerSqM;

        uint256 logComponent = log2(totalProperties + 1) * 0.05 ether;

        uint256 exponentialComponent = (totalProperties / 100) ** 2 * 0.02 ether;

        int256 marketAdjustment = calculateMarketAdjustment();

        uint256 newPrice = basePrice + logComponent + exponentialComponent;

        if(marketAdjustment > 0) {
            newPrice += uint256(marketAdjustment);
        } else {
            newPrice -= uint256(-marketAdjustment);
        }

        // to prevent extreme inflation/deflation
        if (newPrice > pricePerSqM * 130/100) {
            newPrice = pricePerSqM * 130/100; // max +30%
        } 

        // floor price
        if (newPrice < 0.5 ether) {
            newPrice = 0.5 ether;
        }

        return newPrice;

    }

    function calculateMarketAdjustment() internal view returns (int256) {
        uint256 buyCount;
        uint256 sellCount;
        for(uint256 i = 0;  i< recentActions.length; i++) {
            if (recentActions[i] == 1) {
                buyCount++; 
            } else {
                sellCount++;
            }
        }
        int256 pressureFactor = int256(buyCount) - int256(sellCount);
        return pressureFactor * int256(0.01 ether);
    }

    function buyNewProperty(uint256 propertyId, uint256 size) external payable {
    require(!propertyExists[propertyId], "Property already purchased");

    uint256 propertyPrice = size * pricePerSqM;
    require(msg.value >= propertyPrice, "Insufficient Payment");

    properties[propertyId] = Property({
        id: propertyId,
        owner: msg.sender,
        sizeSqM: size,
        forSale: false,
        salePrice: propertyPrice
    });

    propertyExists[propertyId] = true; // Mark as purchased

    userProperties[msg.sender].push(propertyId);

    // Track user info in User struct
    if (!users[msg.sender].exists) {
        users[msg.sender] = User({
            userAddress: msg.sender,
            totalPropertiesOwned: 0,
            totalSqMOwned: 0,
            totalSpent: 0,
            totalEarned: 0,
            ownedPropertyIds: new uint256[](0),
            totalResaleCount: 0,
            landUsed: 0,
            exists: true
        });
    }

    User storage user = users[msg.sender];
    user.totalPropertiesOwned += 1;
    user.totalSqMOwned += size;
    user.totalSpent += propertyPrice;
    user.ownedPropertyIds.push(propertyId);

    trackAction(true); // Register buy action
    pricePerSqM = calculateDynamicPricePerSqM();
    totalSqMSold += size;
    totalProperties++;

    emit PropertyPurchased(msg.sender, propertyId, size, propertyPrice);
}


    function trackAction(bool isBuy) internal {
        if (isBuy) {
            totalBuys++;
            recentActions.push(1);
        } else {
            totalSells++;
            recentActions.push(0);
        }

        if(recentActions.length > MAX_RECENT_ACTIONS) {
            recentActions = trimActions(recentActions);
        }
    }

    function trimActions(uint256[] memory actions) internal pure returns (uint256[] memory) {
        uint256[] memory newActions = new uint256[](MAX_RECENT_ACTIONS);
        for (uint256 i = 0; i < MAX_RECENT_ACTIONS; i++) {
            newActions[i] = actions[actions.length - MAX_RECENT_ACTIONS + i];
        }
        return newActions;
    }



    function listProperyForSale(uint256 propertyId) external {
        require(propertyExists[propertyId], "Property does not exist");
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "you do not own this property");
        require(!property.forSale, "Property already listed");

        uint256 salePrice = property.sizeSqM * pricePerSqM;
        property.forSale = true;
        property.salePrice = salePrice;

        listedPropertyIds.push(propertyId);
        
        emit PropertyListed(propertyId, salePrice);

    }
    

    function buyListedProperty(uint256 propertyId) external payable {
        require(propertyExists[propertyId], "Property does not exist");
        Property storage property = properties[propertyId];
        require(property.forSale, "Property is not for sale");

        uint256 salePrice = property.salePrice;
        require(msg.value >= salePrice, "Insufficient Funds");

        address seller = property.owner;
        property.owner = msg.sender;
        property.forSale = false; //marked as sold
        property.salePrice = 0;

        payable(seller).transfer(salePrice);

        updateUserAfterSale(seller, msg.sender, propertyId, property.sizeSqM, salePrice);
        removeListedProperty(propertyId);
        // register action
        trackAction(false);
        pricePerSqM = calculateDynamicPricePerSqM();
        totalSqMSold += property.sizeSqM;

        emit PropertySold(seller, msg.sender, propertyId, salePrice);


    }

    // update the user after sale

    function updateUserAfterSale(
       address seller,
       address buyer,
       uint256 propertyId,
       uint256 propertySize,
       uint256 salePrice 
    ) internal {
        // seller data update
        User storage sellerUser = users[seller];
        sellerUser.totalPropertiesOwned -= 1;
        sellerUser.totalSqMOwned -= propertySize;
        sellerUser.totalEarned += salePrice;
        sellerUser.totalResaleCount += 1;
        removePropertyFromUser (seller, propertyId);


        // update buyer data
        if(!users[buyer].exists) {
            users[buyer] = User({
            userAddress: buyer,
            totalPropertiesOwned: 0,
            totalSqMOwned: 0,
            totalSpent: 0,
            totalEarned: 0,
            ownedPropertyIds: new uint256[](0),
            totalResaleCount: 0,
            landUsed: 0,
            exists: true
        });
        }

        User storage buyerUser = users[buyer];
        buyerUser.totalPropertiesOwned += 1;
        buyerUser.totalSqMOwned += propertySize;
        buyerUser.totalSpent += salePrice;
        buyerUser.ownedPropertyIds.push(propertyId);

    }


    function removePropertyFromUser(address user, uint256 propertyId) internal {
        uint256[] storage propertiesList = users[user].ownedPropertyIds;
        for (uint256 i = 0; i < propertiesList.length; i++) {
            if(propertiesList[i] == propertyId) {
                propertiesList[i] = propertiesList[propertiesList.length - 1];
                propertiesList.pop();
                break;
            }
        }
    }

    function removeListedProperty(uint256 propertyId) internal {
        for (uint256 i = 0; i < listedPropertyIds.length; i++) {
            if (listedPropertyIds[i] == propertyId) {
                listedPropertyIds[i] = listedPropertyIds[listedPropertyIds.length - 1];
                listedPropertyIds.pop();
                break;
            }
        }
    }





}