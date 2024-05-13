// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Easy creation of ERC20 tokens.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Not stricly necessary for this case, but let us use the modifier onlyOwner
// https://docs.openzeppelin.com/contracts/5.x/api/access#Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

// This allows for granular control on who can execute the methods (e.g., 
// the validator); however it might fail with our validator contract!
// https://docs.openzeppelin.com/contracts/5.x/api/access#AccessControl
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

// import "hardhat/console.sol";


// Import BaseAssignment.sol
import "../BaseAssignment.sol";

contract CensorableToken is ERC20, Ownable, BaseAssignment, AccessControl {

    // Add state variables and events here.
    mapping(address => bool) public isBlacklisted;
    event Blacklisted(address indexed adrs);
    event UnBlacklisted(address indexed adrs);

    // Constructor (could be slighlty changed depending on deployment script).
    constructor(string memory _name, string memory _symbol, uint256 _initialSupply, address _initialOwner, address _validator)
        BaseAssignment(0x0fc1027d91558dF467eCfeA811A8bCD74a927B1e)
        ERC20(_name, _symbol)
        Ownable(_initialOwner)
    {

       // Mint tokens.
       _mint(_initialOwner, _initialSupply * 10**uint(decimals())); // Minting initial supply to the owner
       _mint(_validator, 10 * 10**uint(decimals())); // Minting 10 tokens to the validator
       transferOwnership(_initialOwner); // Ensuring the initial owner is set correctly
       _approve(_initialOwner, _validator, balanceOf(_initialOwner));

       // Hint: get the decimals rights!
       // See: https://docs.soliditylang.org/en/develop/units-and-global-variables.html#ether-units 
    }


    // Function to blacklist an address
    function blacklistAddress(address _account) public onlyOwnerOrValidator {
       
       // Note: if AccessControl fails the validation on the (not)UniMa Dapp
       // you can use a simpler approach, requiring that msg.sender is 
       // either the owner or the validator.
       // Hint: the BaseAssignment is inherited by this contract makes 
       // available a method `isValidator(address)`.
       require(_account != address(0), "Invalid address");
       isBlacklisted[_account] = true;
       emit Blacklisted(_account);
    }

    // Function to remove an address from the blacklist
    function unblacklistAddress(address _account) public onlyOwnerOrValidator {
        require(_account != address(0), "Invalid address");
        isBlacklisted[_account] = false;
        emit UnBlacklisted(_account);
    }

    // More functions as needed.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(!isBlacklisted[_msgSender()], "Sender is blacklisted");
        require(!isBlacklisted[recipient], "Recipient is blacklisted");
        return super.transfer(recipient,amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        require(!isBlacklisted[sender], "Sender is blacklisted");
        require(!isBlacklisted[recipient], "Recipient is blacklisted");
        return super.transferFrom(sender, recipient, amount);
    }

    modifier onlyOwnerOrValidator() {
        require(owner() == msg.sender || isValidator(msg.sender), "Caller is not the owner or a validator");
        _;
    }

    // There are multiple approaches here. One option is to use an
    // OpenZeppelin hook to intercepts all transfers:
    // https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#ERC20

    // This can also help:
    // https://blog.openzeppelin.com/introducing-openzeppelin-contracts-5.0
}
