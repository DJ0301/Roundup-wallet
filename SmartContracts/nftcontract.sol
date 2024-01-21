// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTFunc is ERC721URIStorage, Ownable{
    
    constructor(address initialOwner) ERC721("SavingsExample","SVE") Ownable(initialOwner) {}
    function mint(
    
        address _to,
        uint256 _tokenId,
        string calldata _uri
    ) external onlyOwner{
        _mint(_to,_tokenId);
        _setTokenURI(_tokenId,_uri);
    }
}