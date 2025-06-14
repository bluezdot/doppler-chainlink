/**
 * Test script to validate the new modular configuration
 * Run with: bun run src/config/test-config.ts
 */

import {
    chainConfigs,
    generateAllBlockConfigs,
    generateAllContractConfigs,
    getChainConfig,
    getActiveChains,
    CHAIN_IDS
} from "./index";

// Test chain configurations
console.log("🔗 Testing Chain Configurations");
console.log("Available chains:", Object.keys(chainConfigs));
console.log("Chain IDs:", CHAIN_IDS);



// Test active chains (non-zero airlock addresses)
const activeChains = getActiveChains();
console.log("Active chains:", activeChains.map(c => c.name));

// Test block configurations
console.log("\n📦 Testing Block Configurations");
const blockConfigs = generateAllBlockConfigs();
console.log("Generated block configs:", Object.keys(blockConfigs));
console.log("Example block config:", blockConfigs.ChainlinkEthPriceFeed);

// Test contract configurations
console.log("\n📋 Testing Contract Configurations");
const contractConfigs = generateAllContractConfigs();
console.log("Generated contract configs:", Object.keys(contractConfigs));

// Check if a specific contract exists
if (contractConfigs.Airlock) {
    console.log("Airlock chains:", Object.keys(contractConfigs.Airlock.chain));
}

if (contractConfigs.UniswapV4Pool) {
    console.log("V4 Pool chains:", Object.keys(contractConfigs.UniswapV4Pool.chain));
}

console.log("\n✅ Configuration test completed successfully!");

export { chainConfigs, generateAllBlockConfigs, generateAllContractConfigs };