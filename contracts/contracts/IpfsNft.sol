// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IpfsNFT is ERC721URIStorage, Ownable {
  error IpfsNFT__NeedMoreEthSent();
  error IpfsNFT__TransferFailed();

  //NFT Helpers
  uint256 private s_tokenCounter;

  //Events
  event Nft_Minted(
    address indexed minter,
    uint256 indexed tokenId,
    string tokenURI
  );

  event Nft_Minted(address indexed minter, uint256 indexed tokenId);

  constructor() ERC721("FoxxiRandomNFT", "FXN") {
    s_tokenCounter = 0;
  }

  function staticMint(string memory tokenURI) public returns (uint256) {
    uint256 tokenId = s_tokenCounter;
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
    s_tokenCounter++;
    emit Nft_Minted(msg.sender, tokenId, tokenURI);
    return tokenId;
  }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
  }
}
