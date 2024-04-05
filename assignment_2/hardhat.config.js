require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    numa: {
      url: "http://134.155.50.136:8506",
      chainId: 1337,
      accounts: [`0x${process.env.METAMASK_1_PRIVATE_KEY}`]
    },
  },
};
