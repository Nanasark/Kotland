// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Import ERC20 interface

contract EvolvingTomatoNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public constant MAX_STAGE = 4;

    mapping(uint256 => uint256) public tokenStage;
    mapping(uint256 => string) private stageCIDs;

    address public seedToken;   
    uint256 public mintFee = 100 * 10**18;  

    event NFTMinted(address indexed owner, uint256 tokenId, uint256 stage);
    event NFTEvolved(uint256 indexed tokenId, uint256 newStage);

    constructor(address _seedToken) ERC721("EvolvingTomatoNFT", "TOMNFT") Ownable(msg.sender) {
        seedToken = _seedToken;

        // Initialize IPFS CIDs
        stageCIDs[1] = "bafkreievkoyicb5uengvv4v52wkd6hspefiyt475vqpv2rxy6pmg652tuq";
        stageCIDs[2] = "bafkreih6rs6xiksy5wcn6qy4xnri7x7wcowkkxzs4yvyoau2c6meeqgwcm";
        stageCIDs[3] = "bafkreicfbxkty5pxtrsgmm5el2ghv2zzttrcaxr2cpyemby7wy56mqr44u";
        stageCIDs[4] = "bafkreidw3hxwwwxmiqrgrbkr24zu6ppic3ntku3veca7xdj6b2whvtchmq";
    }

    function mintNFT() external {
        // Collect Seed Token Fee
        require(
            IERC20(seedToken).transferFrom(msg.sender, address(this), mintFee),
            "Seed Token payment failed"
        );

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        tokenStage[tokenId] = 1;
        _safeMint(msg.sender, tokenId);

        emit NFTMinted(msg.sender, tokenId, 1);
    }

    function evolveNFT(uint256 tokenId) external {
        require(_existsPublic(tokenId), "Nonexistent token");
        require(ownerOf(tokenId) == msg.sender, "Not your NFT");
        require(tokenStage[tokenId] < MAX_STAGE, "Already at final stage");

        tokenStage[tokenId]++;
        emit NFTEvolved(tokenId, tokenStage[tokenId]);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_existsPublic(tokenId), "Nonexistent token");

        uint256 currentStage = tokenStage[tokenId];
        string memory cid = stageCIDs[currentStage];

        return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/", cid));
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);

        uint256 counter = 0;
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (ownerOf(i) == owner) {
                tokenIds[counter] = i;
                counter++;
            }
        }

        return tokenIds;
    }

    function getTokenStage(uint256 tokenId) external view returns (uint256) {
        require(_existsPublic(tokenId), "Nonexistent token");
        return tokenStage[tokenId];
    }

    function getStageCID(uint256 stage) external view returns (string memory) {
        require(stage >= 1 && stage <= MAX_STAGE, "Invalid stage");
        return stageCIDs[stage];
    }

    function _existsPublic(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId <= _tokenIdCounter.current();
    }

    // Optional: Owner can set new Seed Token address if needed
    function setSeedToken(address _seedToken) external onlyOwner {
        seedToken = _seedToken;
    }

    // Optional: Owner can set new mint fee
    function setMintFee(uint256 _mintFee) external onlyOwner {
        mintFee = _mintFee;
    }

    // Optional: Withdraw Seed Tokens from the contract
    function withdrawSeedTokens(address to, uint256 amount) external onlyOwner {
        IERC20(seedToken).transfer(to, amount);
    }
}
