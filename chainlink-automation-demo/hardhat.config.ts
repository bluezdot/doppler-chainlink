import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Testnet networks
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR-PROJECT-ID",
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    //   chainId: 11155111,
    // },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532,
    },
    // Mainnet networks
    // mainnet: {
    //   url: process.env.MAINNET_RPC_URL || "https://mainnet.infura.io/v3/YOUR-PROJECT-ID",
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    //   chainId: 1,
    // },
    // base: {
    //   url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    //   chainId: 8453,
    // },
  },
  etherscan: {
    apiKey: {
      // sepolia: process.env.ETHERSCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      // mainnet: process.env.ETHERSCAN_API_KEY || "",
      // base: process.env.BASESCAN_API_KEY || "",
    },
  },
};

export default config;
