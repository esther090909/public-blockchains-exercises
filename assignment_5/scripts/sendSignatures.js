const hre = require("hardhat");
const path = require('path');
// const web3 = require('web3');


async function main() {

  const ethers = hre.ethers;

  // Retrieve signers from Hardhat (as defined in the hardhat.config.js file).
  const [signer1, signer2, signer3] = await ethers.getSigners();

  // Pick the deployer (default is signer1).
  const signer = signer1;
  console.log("Signer is:", signer.address);

  pathToABI = "../artifacts/contracts/StateChannel.sol/StateChannel.json";

  //pathToABI = path.join(
  //  __dirname,
  //  "..",
  //  "artifacts",
  //  "contracts",
  //  "StateChannel.sol",
  //  "StateChannel.json"
  //);

  const ABI = require(pathToABI).abi;
  // console.log(ABI);

  const contractAddr = '0x1661337565bdf9091B7Fc9a70413f240f3EB938D';
  
  // Create contract with attached signer.
  const contract = new ethers.Contract(contractAddr, ABI, signer);

  const getSignature = async (amount) => {

      // Solidity encode packed the hash of address and ETH amount.
      // Hint: https://docs.ethers.org/v6/api/hashing/#solidityPackedKeccak256

      // TODO: Complete the code.
      const hashedMsg = ethers.solidityPackedKeccak256(
        ["address", "uint256"],
        [contractAddr, amount]
      );
      console.log('Hashed msg', hashedMsg);
      
      // Transform to Bytes array before signining.
      const hashedArray = ethers.toBeArray(hashedMsg);
      console.log('Hashed array', hashedArray);


      // Sign the message
      const signature = await signer.signMessage(hashedArray);
      console.log('Signed message hashed', signature);
    
      return signature;
  };

  const sendSignature = async (idx, amount) => {
    let sig = await getSignature(amount);

    // Send the signature to the contract.
    const tx = await contract.addSignature(idx, sig, amount);
    await tx.wait();
    console.log(`Signature ${idx} sent with amount ${amount}`);
  };

  console.log('Adding signatures.');

  // Send the two required signatures.
  await sendSignature(0, 200); // Signature with id 0, 200 wei
  await sendSignature(1, 100); // Signature with id 1, 100 wei

  console.log('Signatures added, verifying');

  let s = await contract.getSignature(0);
  console.log('Sig 0', s);
  s = await contract.getSignatureEthAmount(0);
  console.log('Eth 0', s);

  s = await contract.getSignature(1);
  console.log('Sig 1', s);
  s = await contract.getSignatureEthAmount(1);
  console.log('Eth 1', s);
  
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
