require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require("@nomicfoundation/hardhat-verify");
const { vars } = require("hardhat/config");

const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
    networks: {
      hardhat: {
      },
      sepolia: {
        url: process.env.ALCHEMY_SEPOLIA_API_URL + process.env.ALCHEMY_KEY,
        accounts: [process.env.METAMASK_1_PRIVATE_KEY, process.env.METAMASK_2_PRIVATE_KEY]
      },
      numa: {
        url: process.env.NOT_UNIMA_URL_1,
        chainId: 1337,
        accounts: [`0x${process.env.METAMASK_1_PRIVATE_KEY}`]
      }
    },
  solidity: "0.8.24",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  sourcify: {
    enabled: false,
  },
};