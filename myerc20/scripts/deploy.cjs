require('dotenv').config();
const hre = require("hardhat");
console.log('Hardhat\'s default network:', hre.config.defaultNetwork);
const ethers = require("ethers");
console.log("Ethers version:", ethers.version);
console.log("HH Wrapped Ethers version:", hre.ethers.version);

async function main() {

    const amount = hre.ethers.parseEther("0.1");

    const myerc20 = await hre.ethers.deployContract("MyERC20", [20]);
    
      await myerc20.waitForDeployment();
    
      console.log(
        `MyERC20 deployed to ${myerc20.target}`
      );

}

main()
  .then(()=> {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});