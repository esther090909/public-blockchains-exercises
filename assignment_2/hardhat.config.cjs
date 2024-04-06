require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
const { vars } = require("hardhat/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    numa: {
      url: process.env.NOT_UNIMA_URL_1,
      chainId: 1337,
      accounts: [`0x${process.env.METAMASK_1_PRIVATE_KEY}`]
    },
  },
};
