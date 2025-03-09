// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
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

    struct TileData {
        uint256 id;
        address owner;
        bool isBeingUsed;
        address nftBeingUsed;
        uint256 nftIdBeingStaked;
        bool forSale;
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
            forSale: false
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

    // frontend helper

    function getUserData(
        address userAddress
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
            uint256[] memory
        )
    {
        UserData storage user = users[userAddress]; // Assuming you have a mapping(address => UserData) usersData;
        require(user.exists, "User does not exist");

        return (
            user.userAddress,
            user.totalTilesOwned,
            user.tilesUnderUse,
            user.userExperience,
            user.nftsBought,
            user.nftsSold,
            user.exists,
            user.ownedTileIds
        );
    }

    function getTileData(
        uint256 tileId
    ) external view returns (uint256, address, bool, address, uint256, bool) {
        require(tileExists[tileId], "Tile does not exist");

        TileData storage tile = tiles[tileId]; // Assuming you have a mapping(uint256 => TileData) tiles;

        return (
            tile.id,
            tile.owner,
            tile.isBeingUsed,
            tile.nftBeingUsed,
            tile.nftIdBeingStaked,
            tile.forSale
        );
    }


    function getListedTilesForSale() external view returns (uint256[] memory) {
        return listedTilesForSellingId;
    }

// -----------------------------------------------------

    // staking functions

// -----------------------------------------------------


    function stakeFarmNFT(
        uint256 tileId,
        address nftContract,
        uint256 nftId
    ) external onlyTileOwner(tileId) {
        require(!tiles[tileId].isBeingUsed, "Tile is already in use");

        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(nftId) == msg.sender, "Not the NFT owner");

        nft.transferFrom(msg.sender, address(this), nftId);

        tiles[tileId].isBeingUsed = true;
        tiles[tileId].nftBeingUsed = nftContract;
        tiles[tileId].nftIdBeingStaked = nftId;

        users[msg.sender].tilesUnderUse += 1;
    }

    function unstake(uint256 tileId) external onlyTileOwner(tileId) {
        require(tiles[tileId].isBeingUsed, "No NFT staked");

        address nftContract = tiles[tileId].nftBeingUsed;
        uint256 nftId = tiles[tileId].nftIdBeingStaked;

        IERC721 nft = IERC721(nftContract);
        nft.transferFrom(address(this), msg.sender, nftId);

        tiles[tileId].isBeingUsed = false;
        tiles[tileId].nftBeingUsed = address(0);
        tiles[tileId].nftIdBeingStaked = 0;

        users[msg.sender].tilesUnderUse -= 1;
    }

    function evolveNFT(uint256 tileId) external onlyTileOwner(tileId) {
        require(tiles[tileId].isBeingUsed, "No NFT Staked");

        address nftContract = tiles[tileId].nftBeingUsed;
        uint256 nftId = tiles[tileId].nftIdBeingStaked;

        IEvolvableNFT(nftContract).evolveNFT(nftId);
    }

    function setToken(address _token) external onlyAdmin {
        token = IERC20(_token);
    }

    function setPricePerTile(uint256 _newPrice) external onlyAdmin {
        pricePerTile = _newPrice;
    }
}
