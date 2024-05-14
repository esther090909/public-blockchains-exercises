// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./BaseAssignment.sol";
import "./INFTminter.sol";


// TODO: inherit BaseAssignment and implement INFTminter.

contract NFTminter is ERC721URIStorage, INFTminter, BaseAssignment {
   
    // Use strings methods directly on variables.
    using Strings for uint256;
    using Strings for address;

    uint256 private _nextTokenId;
    uint256 private _totalSupply;
    string private _ipfsHash = "QmaA4UCAPJJ73nUJSCLnrQuHYx6Cc8m6XxMKNhrJeJa9Dg";
    uint256 private _currentPrice = 0.0001 ether; // Starting price
    bool private isSaleActive = true;

    // Other variables as needed ...

    constructor() 
        ERC721("MyArtToken", "MAT")
        BaseAssignment(0x43E66d5710F52A2D0BFADc5752E96f16e62F6a11)
    {
        // Constructor code as needed ...
        _nextTokenId = 1; // Start token ID at 1
    }

    // mint a nft and send to _address
    function mint(address _address) public payable override returns (uint256) {
       //require(msg.value >= _currentPrice, "NFTminter: Not enough ether sent");
       //require(_currentPrice <= 0.05 ether, "NFTminter: Price exceeds limit");
       require(isSaleActive, "NFTminter: Sale is currently inactive");

        uint256 tokenId = _nextTokenId++;
        _totalSupply++;

        // Mint the token
        _mint(_address, tokenId);

        // Update current price, ensuring it doesn't exceed 0.05ETH
        _currentPrice = _currentPrice * 2 > 0.04 ether ? 0.04 ether : _currentPrice * 2;

        // Return token URI
        string memory tokenURI = getTokenURI(tokenId, _address);
    
        // Set encoded token URI to token
        _setTokenURI(tokenId, tokenURI);

        // Refund excess ether if overpaid
        //if (msg.value > _currentPrice) {
        //    payable(msg.sender).transfer(msg.value - _currentPrice);
        //}

        return tokenId;
    }


    // Other methods as needed ...

    function getTotalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function getIPFSHash() public view override returns (string memory) {
        return _ipfsHash;
    }

    function getPrice() public view override returns (uint256) {
        return _currentPrice;
    }

    function burn(uint256 tokenId) public payable override {
        require(msg.value >= 0.0001 ether, "NFTminter: Burning fee is not met");
        require(ownerOf(tokenId) == msg.sender, "NFTminter: Caller is not the owner of the token");

        _burn(tokenId);
        _totalSupply--;
        _currentPrice = 0.0001 ether; // Reset the price after burning an NFT
    }

    function pauseSale() public override {
        require(isValidator(msg.sender) || msg.sender == getOwner(), "Only validator or owner can pause the sale");
        isSaleActive = false;
    }

    function activateSale() public override {
        require(isValidator(msg.sender) || msg.sender == getOwner(), "Only validator or owner can activate the sale");
        isSaleActive = true;
    }

    function getSaleStatus() public view override returns (bool) {
        return isSaleActive;
    }

    function withdraw(uint256 amount) public {
        //require(amount <= address(this).balance, "Insufficient balance in contract");
        require(isValidator(msg.sender) || msg.sender == getOwner(), "Caller is not authorized");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to send Ether");
    }


    /*=============================================
    =                   HELPER                  =
    =============================================*/

    // Get tokenURI for token id
    function getTokenURI(uint256 tokenId, address newOwner)
        public
        view
        returns (string memory)
    {

        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "My beautiful artwork #',
            tokenId.toString(),
            '"', 
            '"hash": "',
            _ipfsHash,
            '",', 
            '"by": "',
            getOwner(),
            '",', 
            '"new_owner": "',
            newOwner,
            '"', 
            "}"
        );

        // Encode dataURI using base64 and return
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }


      // Get tokenURI for token id using string.concat.
    function getTokenURI2(uint256 tokenId, address newOwner)
        public
        view
        returns (string memory)
    {

        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "My beautiful artwork #',
            tokenId.toString(),
            '"', 
            '"hash": "',
            _ipfsHash,
            '",', 
            '"by": "',
            getOwner(),
            '",', 
            '"new_owner": "',
            newOwner,
            '"', 
            "}"
        );

        // Encode dataURI using base64 and return
        return string.concat("data:application/json;base64,",
                                Base64.encode(dataURI));
    }

    // Not actually needed by assignment, but you can try it out 
    // to learn about strings.
    function strlen(string memory s) public pure returns (uint) {
        uint len;
        uint i = 0;
        uint bytelength = bytes(s).length;
        for(len = 0; i < bytelength; len++) {
            bytes1 b = bytes(s)[i];
            if(b < 0x80) {
                i += 1;
            } else if (b < 0xE0) {
                i += 2;
            } else if (b < 0xF0) {
                i += 3;
            } else if (b < 0xF8) {
                i += 4;
            } else if (b < 0xFC) {
                i += 5;
            } else {
                i += 6;
            }
        }
        return len;
    }

}
