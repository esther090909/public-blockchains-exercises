const hre = require("hardhat");
console.log('Hardhat\'s default network:', hre.config.defaultNetwork);
const ethers = hre.ethers;
console.log("Ethers version:", ethers.version);

const contractName = "Lock5";
const contractAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";

async function getContractAndSigner(contractName, contractAddress, signerIdx = 0) {
    
    // Getting the default signer.
    const hardhatSigners = await hre.ethers.getSigners();
    const signer = hardhatSigners[signerIdx];
  
    const contract = await hre.ethers.getContractAt(contractName,contractAddress,signer);
  
    return [ contract, signer ];
}

async function mappings() {
    console.log("Advanced. Exercise 5: Mappings (and payable)");
  
   // Get five contracts for 5 signers.
   const [ lock0, signer0 ] = await getContractAndSigner(contractName, contractAddress, 0);
   const [ lock1, signer1 ] = await getContractAndSigner(contractName, contractAddress, 1);
   const [ lock2, signer2 ] = await getContractAndSigner(contractName, contractAddress, 2);
   const [ lock3, signer3 ] = await getContractAndSigner(contractName, contractAddress, 3);
   const [ lock4, signer4 ] = await getContractAndSigner(contractName, contractAddress, 4);
   
   // This will not be added as owner.
   const [ lock5, signer5 ] = await getContractAndSigner(contractName, contractAddress, 5);
  
    // Let's have 5 owners in total.
    
    // Default signer adds two other owners.
    await lock0.addOwner(signer1.address);
    await lock0.addOwner(signer2.address);
    // Owner at index 2 adds another one.
    await lock2.addOwner(signer3.address);
    // Owner at index 3 adds another one.
    await lock3.addOwner(signer4.address);
  
    // Let's count how many we have.
    await getContractStatus(lock0);
  
    // Let's check the mapping values.
    console.log('Mappings for signers (0-5):')
    console.log(await lock0.owners(signer0.address));
    console.log(await lock0.owners(signer1.address));
    console.log(await lock0.owners(signer2.address));
    console.log(await lock0.owners(signer3.address));
    console.log(await lock0.owners(signer4.address));
    console.log(await lock0.owners(signer5.address));
  
    // Each owner should get 0.2 Ether. Let's check whether it works.
    await checkBalanceBeforeAfter(signer0, lock0);
    await checkBalanceBeforeAfter(signer1, lock1);
    await checkBalanceBeforeAfter(signer2, lock2);
    await checkBalanceBeforeAfter(signer3, lock3);
    await checkBalanceBeforeAfter(signer4, lock4);
}
  
const checkBalanceBeforeAfter = async (signer, lockContract) => {
    // Check the balance change for signer.
    let b1 = await signer.getBalance();
    let tx = await lockContract.withdraw();
    await tx.wait();
    let b2 = await signer.getBalance();
    // With Ethers v5 we need to explicitely cast to BigInt. 
    let diff = BigInt(b2) - BigInt(b1);
    b2 = ethers.utils.formatEther(diff);
    console.log('The balance after withdrawing is net +' + b2 + ' ETH');
  
    await getContractStatus(lockContract);
};
  

const getContractStatus = async lockContract => {
    // Report info about contract.
    let leftInContract = await hre.ethers.provider.getBalance(lockContract.address);
    leftInContract = ethers.utils.formatEther(leftInContract);
    let numOwners = await lockContract.ownerCounter();
    console.log('On lock there is +' + leftInContract + ' ETH left and ' + 
                    numOwners + " owners now");
};
  
mappings();