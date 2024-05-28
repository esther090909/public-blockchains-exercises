const hre = require("hardhat");

async function main() {

    // Get signers added in hardhat.config.js (up to three in this case).
    const [signer1, signer2, signer3] = await hre.ethers.getSigners();

    // Pick the deployer (default is signer1).
    const deployer = signer1;

    console.log('Deploying validator from account:', deployer.address);

    // Deploying the empty validator for local deploying/testing.
    const Val = await hre.ethers.getContractFactory("EmptyValidator", {
        signer: deployer,
    });
    const val = await Val.deploy();
    const valAddress = val.target;
    console.log('Local Validator address: ' + valAddress);

    
    // Now we can deploy the assignment.

    // Todo: replace the name.
    const assContractName = "StateChannel";

    const Ass = await hre.ethers.getContractFactory(assContractName, {
        signer: deployer,
    });

    // We pass the validator address to the constructor (make sure to pass
    // the parameter to the constructor of BaseAssignment).
    
    // Todo: adjust if assignment requires other input parameters.
    const ass = await Ass.deploy();
  
    await ass.waitForDeployment();

    console.log(`Contract deployed to ${ass.target}`);

    // Check that the validator is set correctly.
    const validator = await ass._validator();
    console.log("Validator is " + validator);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
