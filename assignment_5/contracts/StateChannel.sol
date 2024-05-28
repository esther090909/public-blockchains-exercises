// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import BaseAssignment.sol
import "./BaseAssignment.sol";

// Create contract > define Contract Name
contract StateChannel is BaseAssignment {
   
    // state variables
    address public funder;
    address public sender;
    address public receiver;
    uint256 public maxAmount;
    bool public isChannelOpen;
    uint256 public channelTimeout;
    bool public isTimeoutChannel;
    bool private locked; // Reentrancy guard

    // Make sure to set the validator address in the BaseAssignment constructor
    constructor() BaseAssignment(0xD262826BfEF5C03677b26C71FB1136Ab1c1e4863) {}

    // Important!
    // Before verifying a signature with ecrecover, you need to prefix it with
    // "\x19Ethereum Signed Message:\n32", because this is automatically added
    // upon signing outside of solidity to prevent malicious transactions.

    // Event for logging purposes
    event ChannelOpened(address indexed funder, address indexed sender, address indexed receiver, uint256 maxAmount);
    event TimeoutChannelOpened(address indexed funder, address indexed sender, address indexed receiver, uint256 maxAmount, uint256 timeout);
    event ChannelClosed(address indexed receiver, uint256 amount);
    event ChannelExpired(address indexed funder, uint256 amount);
    event ForceReset();

    modifier noReentrancy() {
        require(!locked, "Reentrant call.");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyValidator() {
        require(isValidator(msg.sender), "Caller is not the validator");
        _;
    }
    

    // Signature methods.
    /////////////////////

    // Function to open the payment channel
    function openChannel(address _sender, address _receiver) external payable {
        require(!isChannelOpen && !isTimeoutChannel, "Another channel is already open");
        funder = msg.sender;
        sender = _sender;
        receiver = _receiver;
        maxAmount = msg.value;
        isChannelOpen = true;
        emit ChannelOpened(funder, sender, receiver, maxAmount);
    }

    function openChannelTimeout(address _sender, address _receiver, uint256 timeout) external payable {
        require(!isChannelOpen && !isTimeoutChannel, "Another channel is already open");
        funder = msg.sender;
        sender = _sender;
        receiver = _receiver;
        maxAmount = msg.value;
        channelTimeout = getBlockNumber() + timeout;
        isTimeoutChannel = true;
        emit TimeoutChannelOpened(funder, sender, receiver, maxAmount, channelTimeout);
    }

    // Function to verify the signed payment message
    function verifyPaymentMsg(uint256 ethAmount, bytes memory signature) public view returns (bool) {
        require(isChannelOpen || isTimeoutChannel, "Channel is not open");
        bytes32 message = prefixed(keccak256(abi.encodePacked(this, ethAmount)));
        return recoverSigner(message, signature) == sender && ethAmount <= maxAmount;
    }

    // Function to close the payment channel
    function closeChannel(uint256 ethAmount, bytes memory signature) external {
        require(msg.sender == receiver, "Only receiver can close the channel");
        require(verifyPaymentMsg(ethAmount, signature), "Invalid signature or amount");
        isChannelOpen = false;
        isTimeoutChannel = false;
        payable(receiver).transfer(ethAmount);
        emit ChannelClosed(receiver, ethAmount);
    }

    function closeChannelNoReentrancy(uint256 ethAmount, bytes memory signature) external noReentrancy {
        require(msg.sender == receiver, "Only receiver can close the channel");
        require(verifyPaymentMsg(ethAmount, signature), "Invalid signature or amount");
        isChannelOpen = false;
        isTimeoutChannel = false;
        (bool sent, ) = receiver.call{value: ethAmount}("");
        require(sent, "Failed to send Ether");
        //payable(receiver).transfer(ethAmount);
        emit ChannelClosed(receiver, ethAmount);
    }

    function expireChannel() external {
        require(msg.sender == funder || msg.sender == sender || isValidator(msg.sender), "Not authorized to expire the channel");
        require(isTimeoutChannel, "No timeout channel open");
        require(getBlockNumber() > channelTimeout, "Timeout has not expired");
        isTimeoutChannel = false;
        uint256 remainingAmount = address(this).balance;
        payable(funder).transfer(remainingAmount);
        emit ChannelExpired(funder, remainingAmount);
    }

    // Function to force reset the contract to a new state
    function forceReset() external onlyValidator {
        isChannelOpen = false;
        isTimeoutChannel = false;
        funder = address(0);
        sender = address(0);
        receiver = address(0);
        maxAmount = 0;
        channelTimeout = 0;
        emit ForceReset();
    }

    // Function to add a signed message
    //function addSignature(uint index, bytes memory signature, uint ethAmount) external {
    //    BaseAssignment.addSignature(index, signature, ethAmount);
    //}

    // Recover the address of the signer, from signature and message.
    function recoverSigner(bytes32 message, bytes memory sig)
        internal
        pure
        returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);
        return ecrecover(message, v, r, s);
    }

    // Prepares the data for ecrecover.
    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            uint8,
            bytes32,
            bytes32
        )
    {
        require(sig.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    /*=====  End of HELPER  ======*/
}
