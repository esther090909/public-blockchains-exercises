const hre = require("hardhat");
console.log('Hardhat\'s default network:', hre.config.defaultNetwork);
const ethers = hre.ethers;
console.log("Ethers version:", ethers.version);

const contractName = "Lock3";
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

async function readVar() {
    console.log("Exercise 1: Read Var");

    // You need to get a signer and a contract.
    // Hint: use methods .getContractAt and .getSigners as we did in 
    // 4_Hardhat/2_ex_deploy.js

    const hardhatSigners = await hre.ethers.getSigners();
    const hhSigner = hardhatSigners[0];
    console.log("HH Signer address:", hhSigner.address);

    const lock3 = await hre.ethers.getContractAt(contractName,contractAddress,hhSigner);

    console.log(contractName + " STATE_VAR:", await lock3.STATE_VAR());
    console.log(contractName + " unlockTime:", await lock3.unlockTime());
};

readVar();

async function getContractAndSigner(cName, cAddress, signerIdx = 0) {
    
    // Getting the default signer.
    const hardhatSigners = await hre.ethers.getSigners();
    const signer = hardhatSigners[signerIdx];
  
    const contract = await hre.ethers.getContractAt(cName,cAddress,signer);
  
    return [ contract, signer ];
  }