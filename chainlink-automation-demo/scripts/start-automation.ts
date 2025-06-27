import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Starting automation with account:", deployer.address);

  // Lấy contract address từ environment variable
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Please set CONTRACT_ADDRESS environment variable");
  }

  console.log("Contract address:", contractAddress);

  // Tạo instance của PriceAutomation contract
  const PriceAutomation = await ethers.getContractFactory("PriceAutomation");
  const priceAutomation = PriceAutomation.attach(contractAddress);

  // Lấy thời gian hiện tại
  const currentTime = Math.floor(Date.now() / 1000);
  console.log("Current timestamp:", currentTime);

  // Tính thời gian bắt đầu (ví dụ: 5 phút từ bây giờ)
  const startTime = currentTime + 5 * 60; // 5 phút
  const endTime = startTime + 30 * 60; // 30 phút sau

  console.log("Start time:", startTime, "(" + new Date(startTime * 1000).toISOString() + ")");
  console.log("End time:", endTime, "(" + new Date(endTime * 1000).toISOString() + ")");

  // Bắt đầu automation
  console.log("Starting automation...");
  const tx = await priceAutomation.startAutomation(startTime);
  await tx.wait();

  console.log("Automation started successfully!");

  // Lấy thông tin automation
  const automationInfo = await priceAutomation.isActive();
  const startTimeFromContract = await priceAutomation.startTime();
  const endTimeFromContract = await priceAutomation.endTime();

  console.log("Automation info:");
  console.log("- Is active:", automationInfo);
  console.log("- Start time:", startTimeFromContract.toString());
  console.log("- End time:", endTimeFromContract.toString());

  // Lấy thông tin price feed
  const priceFeedInfo = await priceAutomation.getPriceFeedInfo();
  console.log("Price feed info:");
  console.log("- Decimals:", priceFeedInfo.decimals);
  console.log("- Description:", priceFeedInfo.description);
  console.log("- Version:", priceFeedInfo.version.toString());

  // Lấy giá hiện tại
  const currentPrice = await priceAutomation.getLatestPrice();
  console.log("Current ETH price:", currentPrice.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 