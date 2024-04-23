// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Lock4 {
    uint256 public immutable unlockTime;
    address payable public owner;
    uint256 public immutable blockNumber;

    event Withdrawal(uint amount, uint when);
    event WithdrawalAttempt(uint amount, uint when, address fromWho);

    constructor() payable {
        blockNumber = block.number;
        unlockTime = 1713825735;
        owner = payable(msg.sender);
    }

    function withdraw() public {

        emit WithdrawalAttempt(address(this).balance, block.timestamp, msg.sender);

        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        // require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
