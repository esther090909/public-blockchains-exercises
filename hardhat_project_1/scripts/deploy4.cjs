const hre = require("hardhat");
console.log('Hardhat\'s default network:', hre.config.defaultNetwork);

const ethers = require("ethers");
console.log("Ethers version:", ethers.version);

console.log("HH Wrapped Ethers version:", hre.ethers.version);

async function main() {

  // Deployment script:

  const lockedAmount = hre.ethers.parseEther("0.01");

  // 'value: lockedAmount' parameter specifies the amount of ether (in wei) to be sent
  // along with the transaction. If a contract is designed to handle ether, it often
  // requires an initial amount of ether when being deployed. Sending ether at the time
  // of deployment could be used to "seed" the contract with the necessary funds to
  // operate correctly from the outset.

  const lock4 = await hre.ethers.deployContract("Lock4", {
    value: lockedAmount,
  })

  await lock4.waitForDeployment();

  console.log(
    `Lock4 with ${ethers.formatEther(
      lockedAmount
    )}ETH deployed to ${lock4.target}`
  );

  // End
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(()=> {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});
