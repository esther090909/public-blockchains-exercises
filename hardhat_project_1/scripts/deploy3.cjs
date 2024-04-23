const hre = require("hardhat");
console.log('Hardhat\'s default network:', hre.config.defaultNetwork);

const ethers = require("ethers");
console.log("Ethers version:", ethers.version);

console.log("HH Wrapped Ethers version:", hre.ethers.version);

async function main() {

  // Deployment script:

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 1200;
  const lockedAmount = hre.ethers.parseEther("0.01");
  console.log(`Current Timestamp: ${currentTimestampInSeconds}`);
  console.log(`Unlock Time (should be future): ${unlockTime}`);

  const lock3 = await hre.ethers.deployContract("Lock3", [unlockTime], {
    value: lockedAmount,
  })

  await lock3.waitForDeployment();

  console.log(
    `Lock3 with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock3.target}`
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
