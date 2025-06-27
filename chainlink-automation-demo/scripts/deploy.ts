import { ethers } from "hardhat";

// Chainlink Price Feed addresses
const PRICE_FEEDS = {
  baseSepolia: "0x4200000000000000000000000000000000000006", // WETH (no direct ETH/USD feed)
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const network = await ethers.provider.getNetwork();
  console.log("Network chainId:", network.chainId);

  // Deploy PriceAutomation contract
  const PriceAutomation = await ethers.getContractFactory("PriceAutomation");
  const priceAutomation = await PriceAutomation.deploy(PRICE_FEEDS.baseSepolia);

  await priceAutomation.waitForDeployment();
  const address = await priceAutomation.getAddress();

  console.log("PriceAutomation deployed to:", address);

  // Lưu thông tin deployment
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contractAddress: address,
    priceFeedAddress: PRICE_FEEDS.baseSepolia,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 