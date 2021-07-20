pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public admin;
    uint256 public maxTotalSupply;
    string public folderName;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxTotalSupply,
        string memory _folderName,
        address _admin
    ) ERC721(name, symbol) {
        admin = _admin;
        maxTotalSupply = _maxTotalSupply;
        folderName = _folderName;
    }

    function mintNFT(address to) public returns (string memory) {
        require(msg.sender == admin, "only admin");
        require(maxTotalSupply - 1 >= _tokenIds.current(), "oversupplied");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);
        string memory nftUri = tokenURI(newItemId);
        return nftUri;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function append(
        string memory a,
        string memory b,
        string memory c
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        string memory uri_link =
            append("https://gateway.pinata.cloud/ipfs/", folderName, "/");

        return uri_link;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
