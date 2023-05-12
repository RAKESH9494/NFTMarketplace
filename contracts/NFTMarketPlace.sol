// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketPlace is ERC721URIStorage {
    address payable owner;
    using Counters for Counters.Counter;
    Counters.Counter private tokenID;
    Counters.Counter private NoOfItemSold;

    uint256 NFTPrice = 0.01 ether;

    constructor() ERC721("NFTMarketPlace","RNFT") {
        owner = payable(msg.sender);
    }

    struct TokenProperties {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool status;
    }

    mapping(uint256 => TokenProperties) private AllNFTS;

    function createNFTToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
        require(msg.value == NFTPrice, "Send the specified amount of ether");
        require(price > 0, "Price cannot be negative");

        tokenID.increment();
        uint256 currentTokenId = tokenID.current();

        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);

        AllNFTS[currentTokenId] = TokenProperties(currentTokenId, payable(address(this)), payable(msg.sender), price, true);

        return currentTokenId;
    }

    function SaleNFT(uint256 tokenId) public payable {
        TokenProperties storage token = AllNFTS[tokenId];
        require(token.status == true, "NFT is not available for sale");
        require(msg.value == token.price, "Please pay the exact price for the NFT");
        _transfer(token.seller, msg.sender, tokenId);
        
        owner.transfer(NFTPrice);

        token.seller.transfer(msg.value);
        
        NoOfItemSold.increment();
        token.status = true;
        token.owner = payable(msg.sender);
    }

    function getNFTPrice() public view returns (uint256) {
        return NFTPrice;
    }

    function updateNFTPrice(uint256 price) public payable {
        require(owner == msg.sender, "Only the owner can update the price");
        NFTPrice = price;
    }

    function getAllNFTs() public view returns (TokenProperties[] memory) {
        uint256 totalNFTs = tokenID.current();
        TokenProperties[] memory allNFTs = new TokenProperties[](totalNFTs);

        for (uint256 i = 0; i < totalNFTs; i++) {
            uint256 currentTokenId = i + 1;
            allNFTs[i] = AllNFTS[currentTokenId];
        }

        return allNFTs;
    }

    function getMyNFTs(address pubkey) public view returns (TokenProperties[] memory) {
        uint256 totalNFTs = tokenID.current();
        uint256 userNFTsCount = 0;

        for (uint256 i = 0; i < totalNFTs; i++) {
            uint256 currentTokenId = i + 1;
            if (AllNFTS[currentTokenId].owner == pubkey || AllNFTS[currentTokenId].seller == pubkey) {
                userNFTsCount++;
            }
        }

        TokenProperties[] memory userNFTs = new TokenProperties[](userNFTsCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalNFTs; i++) {
            uint256 currentTokenId = i + 1;
            if (AllNFTS[currentTokenId].owner == pubkey || AllNFTS[currentTokenId].seller ==pubkey) {
                userNFTs[currentIndex] = AllNFTS[currentTokenId];
                currentIndex++;
            }
        }

        return userNFTs;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenURI(tokenId);
    }
}
