import { ethers } from "hardhat";

// Chainlink Automation Registry addresses
const AUTOMATION_REGISTRIES = {
  mainnet: "0x7b3EC232b08BD7b4b3305BE0C044D907B2df960B",
  sepolia: "0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2",
  baseSepolia: "0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2", // Sử dụng Sepolia registry
  base: "0x7b3EC232b08BD7b4b3305BE0C044D907B2df960B", // Sử dụng Mainnet registry
};

// Chainlink Token addresses
const LINK_TOKENS = {
  mainnet: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  sepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  baseSepolia: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Sử dụng Sepolia LINK
  base: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // Sử dụng Mainnet LINK
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Registering automation with account:", deployer.address);

  const network = await ethers.provider.getNetwork();
  console.log("Network chainId:", network.chainId);

  // Lấy registry và LINK token address
  let registryAddress: string;
  let linkTokenAddress: string;
  
  switch (network.chainId) {
    case 1: // mainnet
      registryAddress = AUTOMATION_REGISTRIES.mainnet;
      linkTokenAddress = LINK_TOKENS.mainnet;
      break;
    case 11155111: // sepolia
      registryAddress = AUTOMATION_REGISTRIES.sepolia;
      linkTokenAddress = LINK_TOKENS.sepolia;
      break;
    case 84532: // base sepolia
      registryAddress = AUTOMATION_REGISTRIES.baseSepolia;
      linkTokenAddress = LINK_TOKENS.baseSepolia;
      break;
    case 8453: // base
      registryAddress = AUTOMATION_REGISTRIES.base;
      linkTokenAddress = LINK_TOKENS.base;
      break;
    default:
      throw new Error(`Unsupported network: ${network.chainId}`);
  }

  console.log("Using registry address:", registryAddress);
  console.log("Using LINK token address:", linkTokenAddress);

  // Lấy contract address từ deployment (có thể thay đổi)
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Please set CONTRACT_ADDRESS environment variable");
  }

  console.log("Contract address:", contractAddress);

  // Tạo instance của Automation Registry
  const registryABI = [
    "function registerUpkeep(address target, uint32 gasLimit, address admin, bytes calldata checkData, bytes calldata offChainConfig, uint96 amount) external returns (uint256)",
    "function getUpkeep(uint256 id) external view returns (address target, uint32 executeGas, bytes memory checkData, uint96 balance, address lastKeeper, address admin, uint64 maxValidBlocknumber, uint96 amountSpent)",
  ];

  const registry = new ethers.Contract(registryAddress, registryABI, deployer);

  // Tạo instance của LINK token để approve
  const linkTokenABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ];

  const linkToken = new ethers.Contract(linkTokenAddress, linkTokenABI, deployer);

  // Kiểm tra balance LINK
  const linkBalance = await linkToken.balanceOf(deployer.address);
  console.log("LINK balance:", ethers.formatEther(linkBalance));

  // Số lượng LINK cần thiết cho automation (5 LINK)
  const requiredLink = ethers.parseEther("5");
  
  if (linkBalance < requiredLink) {
    console.log("Insufficient LINK balance. Please get some testnet LINK from faucet.");
    console.log("Sepolia faucet: https://faucets.chain.link/sepolia");
    return;
  }

  // Approve LINK cho registry
  console.log("Approving LINK for registry...");
  const approveTx = await linkToken.approve(registryAddress, requiredLink);
  await approveTx.wait();
  console.log("LINK approved");

  // Đăng ký automation
  console.log("Registering automation...");
  
  const gasLimit = 500000; // Gas limit cho automation
  const admin = deployer.address; // Admin address
  const checkData = "0x"; // Không cần check data
  const offChainConfig = "0x"; // Không cần off-chain config
  const amount = requiredLink; // Số lượng LINK để fund automation

  const registerTx = await registry.registerUpkeep(
    contractAddress,
    gasLimit,
    admin,
    checkData,
    offChainConfig,
    amount
  );

  const receipt = await registerTx.wait();
  console.log("Automation registered successfully!");

  // Lấy upkeep ID từ event
  const upkeepId = receipt.logs[0].topics[1]; // Giả sử event đầu tiên là RegisterUpkeep
  console.log("Upkeep ID:", upkeepId);

  // Lưu thông tin registration
  const registrationInfo = {
    network: network.name,
    chainId: network.chainId,
    contractAddress: contractAddress,
    registryAddress: registryAddress,
    upkeepId: upkeepId,
    admin: admin,
    gasLimit: gasLimit,
    amount: ethers.formatEther(amount),
    timestamp: new Date().toISOString(),
  };

  console.log("Registration info:", JSON.stringify(registrationInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 