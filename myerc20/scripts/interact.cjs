require('dotenv').config();
const hre = require("hardhat");
console.log('Hardhat\'s default network:', hre.config.defaultNetwork);
const ethers = require("ethers");
console.log("Ethers version:", ethers.version);
console.log("HH Wrapped Ethers version:", hre.ethers.version);

const cAddress = "0xA5018267E4e071f0176131a06C8E50440484406F";
const cName = "MyERC20";

const notUniMaUrl = process.env.NOT_UNIMA_URL_1;
const notUniMaProvider = new ethers.JsonRpcProvider(notUniMaUrl);

let signer = new ethers.Wallet(process.env.METAMASK_2_PRIVATE_KEY, notUniMaProvider);
console.log("Signer address: ", signer.address);

let deployer = new ethers.Wallet(process.env.METAMASK_1_PRIVATE_KEY, notUniMaProvider);
console.log("Deployer address: ", deployer.address);

const getContract = async(signer) => {

    // Fetch the ABI from the artifacts.
    const cABI = require("../artifacts/contracts/" + cName + 
                           ".sol/" + cName + ".json").abi;

    // Create the contract and print the address.
    const c = new ethers.Contract(cAddress, cABI, signer);

    console.log(cName + " address: ", c.target);

    return c;
};

const getContractInfo = async () => {
    const contract = await getContract(signer);
    console.log("Total Supply: ", Number(await contract.totalSupply()));
    await getContractBalance();
};

getContractInfo();

const getContractBalance = async (formatEther = true) => {
    let balance = await notUniMaProvider.getBalance(cAddress);
    if (formatEther) balance = ethers.formatEther(balance);
    console.log("ETH in contract: ", balance);
    return balance;
};

//getContractBalance();

const waitForTx = async (tx, verbose) => {
    console.log('Transaction in mempool!');
    if (verbose) console.log(tx);
    else console.log(tx.nonce, tx.hash);
    await tx.wait();
    console.log('Transaction mined!');
};

const transfer = async () => {
    // Get contract.
    const contract = await getContract(deployer);

    // Check balances.
    let balance = await contract.balanceOf(deployer.address);
    console.log("Current sender balance: ", Number(balance));
    let balanceReceiver = await contract.balanceOf(signer.address);
    console.log("Current receiver balance: ", Number(balanceReceiver));
    
    // Transfer.
    let amountToTransfer = 3;
    console.log("Tokens to send: ", amountToTransfer);
    let tx = await contract.transfer(signer.address, amountToTransfer);
    await waitForTx(tx);
    
    // Check balances.
    let balance2 = await contract.balanceOf(deployer.address);
    console.log("Updated sender balance: ", Number(balance2));
    let balanceReceiver2 = await contract.balanceOf(signer.address);
    console.log("Current receiver balance: ", Number(balanceReceiver2));
};

// transfer();

const transferFrom = async () => {
    // Get contracts.
    const contract = await getContract(deployer);
    const contractReceiver = await getContract(signer);
    
    // Approve.
    let tx = await contract.approve(signer.address, 100);
    await waitForTx(tx);
    console.log("Receiver Signer approved for spending!")

    // Check balances.
    let balance = await contract.balanceOf(deployer.address);
    console.log("Current sender balance: ", Number(balance));
    let balanceReceiver = await contract.balanceOf(signer.address);
    console.log("Current receiver balance: ", Number(balanceReceiver));

    // Transfer from.
    let amountToTransfer = 10;
    console.log("Tokens to transfer: ", amountToTransfer);
    tx = await contractReceiver.transferFrom(deployer.address, signer.address, amountToTransfer);
    await waitForTx(tx);

    // Check balances.
    let balance2 = await contract.balanceOf(deployer.address);
    console.log("Updated sender balance: ", Number(balance2));
    let balanceReceiver2 = await contract.balanceOf(signer.address);
    console.log("Current receiver balance: ", Number(balanceReceiver2));

    // Check allowance.
    let allowance = await contract.allowance(deployer.address, signer.address);
    console.log("Allowance left: ", Number(allowance));

};

// transferFrom();

const mint = async (amount) => {
    const contract = await getContract(deployer);    
    let tx = await contract.mint(deployer.address, amount);
    await waitForTx(tx);
    const newTotalSupply = Number(await contract.totalSupply());
    console.log('New total supply:', newTotalSupply);
};

mint(1000);