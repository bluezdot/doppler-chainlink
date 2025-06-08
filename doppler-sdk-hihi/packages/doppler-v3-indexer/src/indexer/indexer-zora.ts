// import { ponder } from "ponder:registry";
// import { computeV3Price, getV3PoolData } from "@app/utils/v3-utils";
// import { computeGraduationThresholdDelta } from "@app/utils/v3-utils/computeGraduationThreshold";
// import {
//   insertPositionIfNotExists,
//   updatePosition,
// } from "./shared/entities/position";
// import { insertTokenIfNotExists } from "./shared/entities/token";
// import {
//   insertOrUpdateDailyVolume,
//   compute24HourPriceChange,
// } from "./shared/timeseries";
// import {
//   insertPoolIfNotExists,
//   insertZoraPoolIfNotExists,
//   updatePool,
// } from "./shared/entities/pool";
// import {
//   insertAssetIfNotExists,
//   insertZoraAssetIfNotExists,
//   updateAsset,
// } from "./shared/entities/asset";
// import { computeDollarLiquidity } from "@app/utils/computeDollarLiquidity";
// import { insertOrUpdateBuckets } from "./shared/timeseries";
// import { getV3PoolReserves } from "@app/utils/v3-utils/getV3PoolData";
// import { fetchEthPrice, updateMarketCap } from "./shared/oracle";
// import { Hex, zeroAddress } from "viem";
// import { pool } from "ponder:schema";

// ponder.on("ZoraFactory:CoinCreated", async ({ event, context }) => {
//   const { coin, currency, pool } = event.args;

//   const creatorAddress = event.transaction.from;

//   let currencyAddress = currency;
//   if (currency == zeroAddress) {
//     currencyAddress = "0x4200000000000000000000000000000000000006";
//   }

//   await insertTokenIfNotExists({
//     tokenAddress: currencyAddress,
//     creatorAddress,
//     timestamp: event.block.timestamp,
//     context,
//     isDerc20: false,
//   });

//   const coinEntity = await insertTokenIfNotExists({
//     tokenAddress: coin,
//     creatorAddress,
//     timestamp: event.block.timestamp,
//     context,
//     isDerc20: true,
//     poolAddress: pool,
//   });

//   const ethPrice = await fetchEthPrice(event.block.timestamp, context);

//   const poolEntity = await insertZoraPoolIfNotExists({
//     poolAddress: pool,
//     assetAddress: coin,
//     numeraireAddress: currencyAddress,
//     timestamp: event.block.timestamp,
//     context,
//   });

//   await insertZoraAssetIfNotExists({
//     assetAddress: coin,
//     timestamp: event.block.timestamp,
//     context,
//     poolAddress: pool,
//     totalSupply: coinEntity.totalSupply,
//     numeraireAddress: currencyAddress,
//   });

//   if (ethPrice) {
//     await insertOrUpdateBuckets({
//       poolAddress: pool,
//       price: poolEntity.price,
//       timestamp: event.block.timestamp,
//       ethPrice,
//       context,
//     });

//     await insertOrUpdateDailyVolume({
//       poolAddress: pool,
//       amountIn: 0n,
//       amountOut: 0n,
//       timestamp: event.block.timestamp,
//       context,
//       tokenIn: coin,
//       tokenOut: currencyAddress,
//       ethPrice,
//     });
//   }
// });

// ponder.on("ZoraUniswapV3Pool:Mint", async ({ event, context }) => {
//   const address = event.log.address;
//   const { tickLower, tickUpper, amount, owner } = event.args;

//   const poolEntity = await context.db.find(pool, {
//     address,
//     chainId: BigInt(context.network.chainId),
//   });

//   if (!poolEntity) {
//     return;
//   }

//   await insertAssetIfNotExists({
//     assetAddress: poolEntity.baseToken,
//     timestamp: event.block.timestamp,
//     context,
//     isZora: true,
//   });

//   const { reserve0, reserve1 } = await getV3PoolReserves({
//     address,
//     token0: poolEntity.isToken0 ? poolEntity.baseToken : poolEntity.quoteToken,
//     token1: poolEntity.isToken0 ? poolEntity.quoteToken : poolEntity.baseToken,
//     context,
//   });

//   const assetBalance = poolEntity.isToken0 ? reserve0 : reserve1;
//   const quoteBalance = poolEntity.isToken0 ? reserve1 : reserve0;

//   const ethPrice = await fetchEthPrice(event.block.timestamp, context);

//   let dollarLiquidity;
//   if (ethPrice) {
//     dollarLiquidity = await computeDollarLiquidity({
//       assetBalance,
//       quoteBalance,
//       price: poolEntity.price,
//       ethPrice,
//     });

//     const graduationThresholdDelta = await computeGraduationThresholdDelta({
//       poolAddress: address,
//       context,
//       tickLower,
//       tickUpper,
//       liquidity: amount,
//       isToken0: poolEntity.isToken0,
//     });

//     if (dollarLiquidity) {
//       await updateAsset({
//         assetAddress: poolEntity.baseToken,
//         context,
//         update: {
//           liquidityUsd: dollarLiquidity,
//         },
//       });

//       await updatePool({
//         poolAddress: address,
//         context,
//         update: {
//           graduationThreshold:
//             poolEntity.graduationThreshold + graduationThresholdDelta,
//           liquidity: poolEntity.liquidity + amount,
//           dollarLiquidity: dollarLiquidity,
//         },
//       });
//     } else {
//       await updatePool({
//         poolAddress: address,
//         context,
//         update: {
//           graduationThreshold:
//             poolEntity.graduationThreshold + graduationThresholdDelta,
//           liquidity: poolEntity.liquidity + amount,
//         },
//       });
//     }
//   } else {
//     await updatePool({
//       poolAddress: address,
//       context,
//       update: {
//         graduationThreshold: poolEntity.graduationThreshold,
//         liquidity: poolEntity.liquidity + amount,
//       },
//     });
//   }

//   if (ethPrice) {
//     await updateMarketCap({
//       assetAddress: poolEntity.baseToken,
//       price: poolEntity.price,
//       ethPrice,
//       context,
//     });
//   }

//   await updateAsset({
//     assetAddress: poolEntity.baseToken,
//     context,
//     update: {
//       liquidityUsd: dollarLiquidity ?? 0n,
//     },
//   });

//   const positionEntity = await insertPositionIfNotExists({
//     poolAddress: address,
//     tickLower,
//     tickUpper,
//     liquidity: amount,
//     owner,
//     timestamp: event.block.timestamp,
//     context,
//   });

//   if (positionEntity.createdAt != event.block.timestamp) {
//     await updatePosition({
//       poolAddress: address,
//       tickLower,
//       tickUpper,
//       context,
//       update: {
//         liquidity: positionEntity.liquidity + amount,
//       },
//     });
//   }
// });

// ponder.on("ZoraUniswapV3Pool:Burn", async ({ event, context }) => {
//   const address = event.log.address;
//   const { tickLower, tickUpper, owner, amount } = event.args;

//   const poolEntity = await context.db.find(pool, {
//     address,
//     chainId: BigInt(context.network.chainId),
//   });

//   if (!poolEntity) {
//     return;
//   }

//   await insertAssetIfNotExists({
//     assetAddress: poolEntity.baseToken,
//     timestamp: event.block.timestamp,
//     context,
//     isZora: true,
//   });

//   const { liquidity, price, reserve0, reserve1, token0, poolState } =
//     await getV3PoolData({
//       address,
//       context,
//       isZora: true,
//     });

//   const assetBalance = poolEntity.isToken0 ? reserve0 : reserve1;
//   const quoteBalance = poolEntity.isToken0 ? reserve1 : reserve0;

//   const ethPrice = await fetchEthPrice(event.block.timestamp, context);

//   let dollarLiquidity;
//   if (ethPrice) {
//     dollarLiquidity = await computeDollarLiquidity({
//       assetBalance,
//       quoteBalance,
//       price,
//       ethPrice,
//     });
//     await updateMarketCap({
//       assetAddress: poolEntity.baseToken,
//       price,
//       ethPrice,
//       context,
//     });
//     await updateAsset({
//       assetAddress: poolEntity.baseToken,
//       context,
//       update: {
//         liquidityUsd: dollarLiquidity ?? 0n,
//       },
//     });
//   }

//   const graduationThresholdDelta = await computeGraduationThresholdDelta({
//     poolAddress: address,
//     context,
//     tickLower,
//     tickUpper,
//     liquidity,
//     isToken0: token0.toLowerCase() === poolState.asset.toLowerCase(),
//   });

//   await updatePool({
//     poolAddress: address,
//     context,
//     update: dollarLiquidity
//       ? {
//           liquidity: liquidity - amount,
//           dollarLiquidity: dollarLiquidity,
//           graduationThreshold:
//             poolEntity.graduationThreshold - graduationThresholdDelta,
//         }
//       : {
//           liquidity: liquidity - amount,
//           graduationThreshold:
//             poolEntity.graduationThreshold - graduationThresholdDelta,
//         },
//   });

//   const positionEntity = await insertPositionIfNotExists({
//     poolAddress: address,
//     tickLower,
//     tickUpper,
//     liquidity: amount,
//     owner,
//     timestamp: event.block.timestamp,
//     context,
//   });

//   await updatePosition({
//     poolAddress: address,
//     tickLower,
//     tickUpper,
//     context,
//     update: {
//       liquidity: positionEntity.liquidity - amount,
//     },
//   });
// });

// ponder.on("ZoraUniswapV3Pool:Swap", async ({ event, context }) => {
//   const address = event.log.address;
//   const { amount0, amount1, sqrtPriceX96 } = event.args;

//   const poolEntity = await context.db.find(pool, {
//     address,
//     chainId: BigInt(context.network.chainId),
//   });

//   if (!poolEntity) {
//     return;
//   }

//   const ethPrice = await fetchEthPrice(event.block.timestamp, context);

//   const price = await computeV3Price({
//     sqrtPriceX96,
//     isToken0: poolEntity.isToken0,
//     decimals: 18,
//   });

//   const assetBalance = poolEntity.isToken0
//     ? poolEntity.reserves0 + amount0
//     : poolEntity.reserves1 + amount1;
//   const quoteBalance = poolEntity.isToken0
//     ? poolEntity.reserves1 + amount1
//     : poolEntity.reserves0 + amount0;

//   const tokenIn =
//     poolEntity.isToken0 && amount0 > 0n
//       ? poolEntity.baseToken
//       : poolEntity.quoteToken;
//   const tokenOut =
//     poolEntity.isToken0 && amount0 > 0n
//       ? poolEntity.quoteToken
//       : poolEntity.baseToken;

//   let amountIn;
//   let amountOut;
//   let fee0;
//   let fee1;
//   if (amount0 > 0n) {
//     amountIn = amount0;
//     amountOut = amount1;
//     fee0 = (amountIn * BigInt(poolEntity.fee)) / BigInt(1_000_000);
//     fee1 = 0n;
//   } else {
//     amountIn = amount1;
//     amountOut = amount0;
//     fee1 = (amountIn * BigInt(poolEntity.fee)) / BigInt(1_000_000);
//     fee0 = 0n;
//   }

//   const quoteDelta = poolEntity.isToken0 ? amount1 - fee1 : amount0 - fee0;

//   let dollarLiquidity;
//   let priceChangeInfo;
//   if (ethPrice) {
//     await insertOrUpdateBuckets({
//       poolAddress: address,
//       price,
//       timestamp: event.block.timestamp,
//       ethPrice,
//       context,
//     });

//     await insertOrUpdateDailyVolume({
//       poolAddress: address,
//       amountIn,
//       amountOut,
//       timestamp: event.block.timestamp,
//       context,
//       tokenIn,
//       tokenOut,
//       ethPrice,
//     });

//     priceChangeInfo = await compute24HourPriceChange({
//       poolAddress: address,
//       currentPrice: price,
//       ethPrice,
//       currentTimestamp: event.block.timestamp,
//       createdAt: poolEntity.createdAt,
//       context,
//     });

//     await updateMarketCap({
//       assetAddress: poolEntity.baseToken,
//       price,
//       ethPrice,
//       context,
//     });

//     dollarLiquidity = await computeDollarLiquidity({
//       assetBalance,
//       quoteBalance,
//       price,
//       ethPrice,
//     });
//   }

//   await updatePool({
//     poolAddress: address,
//     context,
//     update: {
//       price: price,
//       dollarLiquidity: dollarLiquidity,
//       totalFee0: poolEntity.totalFee0 + fee0,
//       totalFee1: poolEntity.totalFee1 + fee1,
//       graduationBalance: poolEntity.graduationBalance + quoteDelta,
//       lastRefreshed: event.block.timestamp,
//       lastSwapTimestamp: event.block.timestamp,
//       percentDayChange: priceChangeInfo,
//     },
//   });

//   await updateAsset({
//     assetAddress: poolEntity.baseToken,
//     context,
//     update: {
//       liquidityUsd: dollarLiquidity ?? 0n,
//       percentDayChange: priceChangeInfo,
//     },
//   });
// });
