const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
    let Q1 = "Taylor Swift has never won a Grammy Award";
    let A1 = false;
    let Q2 = "Taylor Swift's album '1989' was her first official pop music album";
    let A2 = true;
    let Q3 = "Was Taylor Swift born in Nashville?";
    let A3 = false;
    let Q4 = "Taylor Swift collaborated with Kendrick Lamar on the song 'Bad Blood'";
    let A4 = true;
    let Q5 = "Taylor Swift's first re-recording was the album 'Red'";
    let A5 = false;

    const [deployer] = await hre.ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);

    const arg1 = [Q1,Q2,Q3,Q4,Q5];
    const arg2 = [A1,A2,A3,A4,A5];
  
    const MyQuiz = await hre.ethers.getContractFactory("MyQuiz");
    const myQuiz = await MyQuiz.deploy(arg1, arg2);
    
    console.log("MyQuiz deployed to:", myQuiz.address);
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