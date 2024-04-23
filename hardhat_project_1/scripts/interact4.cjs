const hre = require("hardhat");
console.log('Hardhat\'s default network:', hre.config.defaultNetwork);
const ethers = hre.ethers;
console.log("Ethers version:", ethers.version);

const contractName = "Lock4";
const contractAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

async function getContractAndSigner(contractName, contractAddress, signerIdx = 0) {
    
    // Getting the default signer.
    const hardhatSigners = await hre.ethers.getSigners();
    const signer = hardhatSigners[signerIdx];
  
    const contract = await hre.ethers.getContractAt(contractName,contractAddress,signer);
  
    return [ contract, signer ];
}

async function constructor() {
    console.log("Exercise 3: Constructor");
  
    const [ lock ] = await getContractAndSigner(contractName, contractAddress);
  
    let blockNum = await lock.blockNumber();
    console.log(contractName + " blockNumber:", Number(blockNum));
}
  
constructor();


async function events() {
    console.log("Exercise 4: Events");

    const [ lock ] = await getContractAndSigner(contractName, contractAddress);
  
    // ...args is a special notation (rest operator) to combine any number
    // of input arguments into an array.
    // https://www.freecodecamp.org/news/three-dots-operator-in-javascript/
    lock.on("WithdrawalAttempt", (...args) => {
        console.log("Attempted Withdrwal");
        console.log(args);
    });
  
    // You can also access the input arguments directly.
    lock.on("Withdrawal", (balance, timestamp) => {
        console.log("Withdrawal");
        console.log("Balance: ", balance);
        console.log("Timestamp: ", timestamp);
        process.exit(0);
    });
  
    // Try and catch is not necessary, but it will hide a long error message.
    try {
        await lock.withdraw();
    }
    catch (e) {
        console.log("An exception occurred.");
    }
}
  
events();


async function getAllEvents() {
    console.log("Bonus. Exercise 4: Get All Events");
  
    const [ lock ] = await getContractAndSigner(contractName, contractAddress);
  
    let fromBlock = 0;
    let toBlock = hre.ethers.provider.getBlock().number;
    const events = await lock.queryFilter("*", fromBlock, toBlock);
  
    console.log(contractName + ": " + events.length + " events found.");
  
    console.log("First Event:");
    console.log(events[0]);
}
  
getAllEvents();