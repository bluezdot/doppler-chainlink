# Doppler V3 SDK

[![npm version](https://img.shields.io/npm/v/doppler-v3-sdk.svg)](https://www.npmjs.com/package/doppler-v3-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript SDK for interacting with Doppler V3 protocol - a Liquidity Bootstrapping Protocol built on Uniswap V3.

## Features

- 🏭 Factory interactions for doppler contract creation and management
- 💰 Token operations including DERC20 and native ETH handling
- 🔍 Historical event querying for pools and tokens

## Installation

```bash
# Using npm
npm install doppler-v3-sdk

# Using bun
bun add doppler-v3-sdk
```

## Core Concepts

### Factory Interactions

```typescript
import { ReadFactory } from "doppler-v3-sdk";

const factory = new ReadFactory("0x...factoryAddress");
const assetData = await factory.getAssetData(tokenAddress);
const createEvents = await factory.getCreateEvents();
```

### Token Operations

```typescript
// ERC20 Token
const derc20 = new ReadDerc20(tokenAddress);
const balance = await derc20.getBalanceOf(userAddress);

// Native ETH
const eth = new ReadEth();
const ethBalance = await eth.getBalanceOf(userAddress);
```

### Pool Analytics

```typescript
const pool = new ReadUniswapV3Pool(poolAddress);
const [slot0, swapEvents] = await Promise.all([
  pool.getSlot0(),
  pool.getSwapEvents(),
]);
```

### Price Quoting

```typescript
const quoter = new ReadQuoter(quoterAddress);
const quote = await quoter.quoteExactInput({
  params: {
    tokenIn: "0x...",
    tokenOut: "0x...",
    amountIn: parseUnits("1", 18),
    fee: 3000,
  },
  options: {
    tokenDecimals: 18,
    formatDecimals: 4,
  },
});
```

## Key Components

| Component           | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `ReadFactory`       | Interface for reading from the Doppler airlock contract |
| `ReadWriteFactory`  | Interface for writing to the Doppler airlock contract   |
| `ReadDerc20`        | DERC20 token operations with vesting support            |
| `ReadEth`           | Native ETH operations                                   |
| `ReadUniswapV3Pool` | Interface for Uniswap V3 pool contract operations       |
| `ReadInitializer`   | Interface for the UniswapV3Initializer contract         |
| `ReadQuoter`        | Price quoting engine with fixed-point precision         |

## Examples

### Basic Swap Simulation

```typescript
import { ReadQuoter, fixed } from "doppler-v3-sdk";

const quoter = new ReadQuoter("0x...quoterAddress");
const amountIn = fixed(1.5, 18); // 1.5 tokens with 18 decimals

const quote = await quoter.quoteExactInput(
  {
    tokenIn: "0x...",
    tokenOut: "0x...",
    amountIn: amountIn.toBigInt(),
    fee: 3000,
  },
  { tokenDecimals: 18, formatDecimals: 4 }
);

console.log(`Expected output: ${quote.formattedAmountOut}`);
```

Note: for executing swaps see doppler-router [here](https://github.com/whetstoneresearch/doppler-sdk/tree/main/packages/doppler-router)

### Uniswap V3 Pool Data Queries

```typescript
import { ReadUniswapV3Pool } from "doppler-v3-sdk";

const pool = new ReadUniswapV3Pool("0x...poolAddress");
const [slot0, liquidityEvents] = await Promise.all([
  pool.getSlot0(),
  pool.getMintEvents(),
]);

console.log(`Current price: ${slot0.sqrtPriceX96}`);
console.log(`${liquidityEvents.length} liquidity positions found`);
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
