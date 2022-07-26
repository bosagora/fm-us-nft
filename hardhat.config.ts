import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-web3";

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    standalone: {
      url: process.env.URL_STANDALONE,
      accounts: [process.env.PRIVATE_KEY_STANDALONE || ""],
      chainId: 1281,
    },
    biztestnet: {
      url: process.env.URL_BIZTESTNET || "",
      chainId: 2019,
      accounts: [process.env.PRIVATE_KEY_BIZTESTNET || ""],
      gasPrice: 1500000000
    },
    biznet: {
      url: process.env.URL_BIZNET || "",
      chainId: 2151,
      accounts: [process.env.PRIVATE_KEY_BIZNET || ""],
      gasPrice: 1500000000
    },
  }
};

export default config;
