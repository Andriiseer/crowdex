pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT is ERC721Enumerable {
    uint256 public nextTokenId;
    address public admin;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        admin = msg.sender;
    }

    function mint(address to) external {
        require(msg.sender == admin, "only admin");
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    function _baseURI() internal view override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/";
    }
}
