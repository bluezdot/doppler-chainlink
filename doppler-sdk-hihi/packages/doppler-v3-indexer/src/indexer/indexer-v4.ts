import { ponder } from "ponder:registry";
import { getV4PoolData } from "@app/utils/v4-utils";
import { insertTokenIfNotExists } from "./shared/entities/token";
import { computeMarketCap, fetchEthPrice } from "./shared/oracle";
import { insertPoolIfNotExistsV4, updatePool } from "./shared/entities/pool";
import { insertOrUpdateDailyVolume } from "./shared/timeseries";
import { insertAssetIfNotExists, updateAsset } from "./shared/entities/asset";
import { insertOrUpdateBuckets } from "./shared/timeseries";
import { computeDollarLiquidity } from "@app/utils/computeDollarLiquidity";
import { insertV4ConfigIfNotExists } from "./shared/entities/v4-entities/v4Config";
import { getReservesV4 } from "@app/utils/v4-utils/getV4PoolData";
import { computeV4Price } from "@app/utils/v4-utils/computeV4Price";
import {
  addCheckpoint,
  insertCheckpointBlobIfNotExist,
} from "./shared/entities/v4-entities/v4CheckpointBlob";
import {
  addAndUpdateV4PoolPriceHistory,
  insertV4PoolPriceHistoryIfNotExists,
} from "./shared/entities/v4-entities/v4PoolPriceHistory";
import { insertActivePoolsBlobIfNotExists } from "./shared/scheduledJobs";
import { insertSwapIfNotExists } from "./shared/entities/swap";
import { CHAINLINK_ETH_DECIMALS } from "@app/utils/constants";

ponder.on("UniswapV4Initializer:Create", async ({ event, context }) => {
  const { poolOrHook, asset: assetId, numeraire } = event.args;
  const { block } = event;
  const timestamp = block.timestamp;

  const poolAddress = poolOrHook.toLowerCase() as `0x${string}`;
  const assetAddress = assetId.toLowerCase() as `0x${string}`;
  const numeraireAddress = numeraire.toLowerCase() as `0x${string}`;

  const creatorAddress = event.transaction.from.toLowerCase() as `0x${string}`;

  const v4PoolData = await getV4PoolData({
    hook: poolAddress,
    context,
  });

  if (!v4PoolData) {
    return;
  }

  const [baseToken, , , , , ,] = await Promise.all([
    insertTokenIfNotExists({
      tokenAddress: assetAddress,
      creatorAddress,
      timestamp,
      context,
      isDerc20: true,
      poolAddress: poolAddress,
    }),
    insertTokenIfNotExists({
      tokenAddress: numeraireAddress,
      creatorAddress,
      timestamp,
      context,
      isDerc20: false,
    }),
    insertCheckpointBlobIfNotExist({
      context,
    }),
    insertV4PoolPriceHistoryIfNotExists({
      pool: poolAddress,
      context,
    }),
    insertActivePoolsBlobIfNotExists({
      context,
    }),
  ]);

  const { totalSupply } = baseToken;

  const [ethPrice, poolEntity, v4Config] = await Promise.all([
    fetchEthPrice(timestamp, context),
    insertPoolIfNotExistsV4({
      poolAddress,
      timestamp,
      context,
      totalSupply,
    }),
    insertV4ConfigIfNotExists({
      hookAddress: poolAddress,
      context,
    }),
  ]);

  if (!v4Config) {
    return;
  }

  const price = poolEntity.price;
  const marketCapUsd = computeMarketCap({
    price,
    ethPrice,
    totalSupply,
  });

  await Promise.all([
    insertAssetIfNotExists({
      assetAddress: assetAddress,
      timestamp,
      context,
      marketCapUsd,
    }),
    insertOrUpdateBuckets({
      poolAddress: poolAddress,
      price: poolEntity.price,
      timestamp,
      ethPrice,
      context,
    }),
    addCheckpoint({
      poolAddress: poolAddress,
      asset: assetAddress,
      totalSupply,
      startingTime: v4Config?.startingTime,
      endingTime: v4Config?.endingTime,
      epochLength: v4Config?.epochLength,
      isToken0: v4Config?.isToken0,
      poolKey: v4PoolData.poolKey,
      context,
    }),
  ]);

  await insertOrUpdateDailyVolume({
    poolAddress: poolAddress,
    amountIn: 0n,
    amountOut: 0n,
    timestamp,
    context,
    tokenIn: assetAddress,
    tokenOut: numeraireAddress,
    ethPrice,
    marketCapUsd,
  });
});

ponder.on("UniswapV4Pool:Swap", async ({ event, context }) => {
  const address = event.log.address.toLowerCase() as `0x${string}`;
  const { currentTick, totalProceeds, totalTokensSold } = event.args;
  const timestamp = event.block.timestamp;

  const v4PoolData = await getV4PoolData({
    hook: address,
    context,
  });

  if (!v4PoolData) {
    return;
  }

  const {
    isToken0,
    baseToken,
    quoteToken,
    totalProceeds: totalProceedsPrev,
    totalTokensSold: totalTokensSoldPrev,
    marketCapUsd: marketCapUsdPrev,
  } = await insertPoolIfNotExistsV4({
    poolAddress: address,
    timestamp,
    context,
  });

  let amountIn = 0n;
  let amountOut = 0n;
  let tokenIn = baseToken;
  let tokenOut = baseToken;
  if (totalProceeds > totalProceedsPrev) {
    amountIn = totalProceeds - totalProceedsPrev;
    amountOut = totalTokensSoldPrev - totalTokensSold;
    tokenIn = quoteToken;
    tokenOut = baseToken;
  } else {
    amountIn = totalTokensSoldPrev - totalTokensSold;
    amountOut = totalProceedsPrev - totalProceeds;
    tokenIn = baseToken;
    tokenOut = quoteToken;
  }

  const { totalSupply } = await insertTokenIfNotExists({
    tokenAddress: baseToken,
    creatorAddress: event.transaction.from,
    timestamp,
    context,
  });

  const price = computeV4Price({
    isToken0,
    currentTick,
    baseTokenDecimals: 18,
  });

  const [ethPrice, reserves] = await Promise.all([
    fetchEthPrice(event.block.timestamp, context),
    getReservesV4({
      hook: address,
      context,
    }),
  ]);
  const { token0Reserve, token1Reserve } = reserves;

  const dollarLiquidity = computeDollarLiquidity({
    assetBalance: isToken0 ? token0Reserve : token1Reserve,
    quoteBalance: isToken0 ? token1Reserve : token0Reserve,
    price,
    ethPrice,
  });

  let marketCapUsd;
  if (price == 340256786698763678858396856460488307819979090561464864775n) {
    marketCapUsd = marketCapUsdPrev;
  } else {
    marketCapUsd = computeMarketCap({
      price,
      ethPrice,
      totalSupply,
    });
  }

  await Promise.all([
    updateAsset({
      assetAddress: baseToken,
      context,
      update: {
        liquidityUsd: dollarLiquidity,
        marketCapUsd,
      },
    }),
    updatePool({
      poolAddress: address,
      context,
      update: {
        liquidity: v4PoolData.liquidity,
        dollarLiquidity: dollarLiquidity,
        totalProceeds,
        totalTokensSold,
        marketCapUsd,
      },
    }),
    addAndUpdateV4PoolPriceHistory({
      pool: address,
      timestamp: Number(event.block.timestamp),
      marketCapUsd,
      context,
    }),
    insertOrUpdateBuckets({
      poolAddress: address,
      price,
      timestamp,
      ethPrice,
      context,
    }),
  ]);

  await insertOrUpdateDailyVolume({
    poolAddress: address,
    amountIn,
    amountOut,
    timestamp,
    context,
    tokenIn,
    tokenOut,
    ethPrice,
    marketCapUsd,
  });
});

ponder.on("UniswapV4Initializer2:Create", async ({ event, context }) => {
  const { poolOrHook, asset: assetId, numeraire } = event.args;
  const { block } = event;
  const timestamp = block.timestamp;

  const poolAddress = poolOrHook.toLowerCase() as `0x${string}`;
  const assetAddress = assetId.toLowerCase() as `0x${string}`;
  const numeraireAddress = numeraire.toLowerCase() as `0x${string}`;

  const v4PoolData = await getV4PoolData({
    hook: poolAddress,
    context,
  });
  if (!v4PoolData) {
    return;
  }

  const creatorAddress = event.transaction.from.toLowerCase() as `0x${string}`;

  const [baseToken, , , , , ,] = await Promise.all([
    insertTokenIfNotExists({
      tokenAddress: assetAddress,
      creatorAddress,
      timestamp,
      context,
      isDerc20: true,
      poolAddress: poolAddress,
    }),
    insertTokenIfNotExists({
      tokenAddress: numeraireAddress,
      creatorAddress,
      timestamp,
      context,
      isDerc20: false,
    }),
    insertCheckpointBlobIfNotExist({
      context,
    }),
    insertV4PoolPriceHistoryIfNotExists({
      pool: poolAddress,
      context,
    }),
    insertActivePoolsBlobIfNotExists({
      context,
    }),
  ]);

  const { totalSupply } = baseToken;

  const [ethPrice, poolEntity, v4Config] = await Promise.all([
    fetchEthPrice(timestamp, context),
    insertPoolIfNotExistsV4({
      poolAddress,
      timestamp,
      context,
      totalSupply,
    }),
    insertV4ConfigIfNotExists({
      hookAddress: poolAddress,
      context,
    }),
  ]);

  const price = poolEntity.price;
  const marketCapUsd = computeMarketCap({
    price,
    ethPrice,
    totalSupply,
  });

  if (!v4Config) {
    return;
  }

  await Promise.all([
    insertAssetIfNotExists({
      assetAddress: assetAddress,
      timestamp,
      context,
      marketCapUsd,
    }),
    insertOrUpdateBuckets({
      poolAddress: poolAddress,
      price: poolEntity.price,
      timestamp,
      ethPrice,
      context,
    }),
    addCheckpoint({
      poolAddress: poolAddress,
      asset: assetAddress,
      totalSupply,
      startingTime: v4Config.startingTime,
      endingTime: v4Config.endingTime,
      epochLength: v4Config.epochLength,
      isToken0: v4Config.isToken0,
      poolKey: v4PoolData.poolKey,
      context,
    }),
  ]);
  await insertOrUpdateDailyVolume({
    poolAddress: poolAddress,
    amountIn: 0n,
    amountOut: 0n,
    timestamp,
    context,
    tokenIn: assetAddress,
    tokenOut: numeraireAddress,
    ethPrice,
    marketCapUsd,
  });
});

ponder.on("UniswapV4Pool2:Swap", async ({ event, context }) => {
  const address = event.log.address.toLowerCase() as `0x${string}`;
  const { chain } = context;
  const { currentTick, totalProceeds, totalTokensSold } = event.args;
  const timestamp = event.block.timestamp;

  const chainId = chain.id;

  const v4PoolData = await getV4PoolData({
    hook: address,
    context,
  });
  if (!v4PoolData) {
    return;
  }

  const {
    isToken0,
    baseToken,
    quoteToken,
    totalProceeds: totalProceedsPrev,
    totalTokensSold: totalTokensSoldPrev,
    marketCapUsd: marketCapUsdPrev,
  } = await insertPoolIfNotExistsV4({
    poolAddress: address,
    timestamp,
    context,
  });

  const ethPrice = await fetchEthPrice(event.block.timestamp, context);

  let amountIn = 0n;
  let amountOut = 0n;
  let tokenIn = baseToken;
  let tokenOut = baseToken;
  let type = "buy";
  let swapValueUsd = 0n;
  if (totalProceeds > totalProceedsPrev) {
    type = "buy";
    amountIn = totalProceeds - totalProceedsPrev;
    amountOut = totalTokensSoldPrev - totalTokensSold;
    tokenIn = quoteToken;
    tokenOut = baseToken;
    swapValueUsd = amountIn * ethPrice / CHAINLINK_ETH_DECIMALS;
  } else {
    type = "sell";
    amountIn = totalTokensSoldPrev - totalTokensSold;
    amountOut = totalProceedsPrev - totalProceeds;
    tokenIn = baseToken;
    tokenOut = quoteToken;
    swapValueUsd = amountOut * ethPrice / CHAINLINK_ETH_DECIMALS;
  }

  const { totalSupply } = await insertTokenIfNotExists({
    tokenAddress: baseToken,
    creatorAddress: event.transaction.from,
    timestamp,
    context,
  });

  const price = computeV4Price({
    isToken0,
    currentTick,
    baseTokenDecimals: 18,
  });

  const [reserves] = await Promise.all([
    getReservesV4({
      hook: address,
      context,
    }),
  ]);
  const { token0Reserve, token1Reserve } = reserves;

  const dollarLiquidity = computeDollarLiquidity({
    assetBalance: isToken0 ? token0Reserve : token1Reserve,
    quoteBalance: isToken0 ? token1Reserve : token0Reserve,
    price,
    ethPrice,
  });


  let marketCapUsd;
  // control for edge case where we jump to min/max tick
  if (price == 340256786698763678858396856460488307819979090561464864775n) {
    marketCapUsd = marketCapUsdPrev;
  } else {
    marketCapUsd = computeMarketCap({
      price,
      ethPrice,
      totalSupply,
    });
  }

  await Promise.all([
    updateAsset({
      assetAddress: baseToken,
      context,
      update: {
        liquidityUsd: dollarLiquidity,
        marketCapUsd,
      },
    }),
    updatePool({
      poolAddress: address,
      context,
      update: {
        liquidity: v4PoolData.liquidity,
        dollarLiquidity: dollarLiquidity,
        totalProceeds,
        totalTokensSold,
        marketCapUsd,
      },
    }),
    insertSwapIfNotExists({
      txHash: event.transaction.hash,
      timestamp,
      context,
      pool: address,
      asset: baseToken,
      chainId: BigInt(chainId),
      type,
      user: event.transaction.from,
      amountIn,
      amountOut,
      usdPrice: swapValueUsd,
    }),
    addAndUpdateV4PoolPriceHistory({
      pool: address,
      timestamp: Number(event.block.timestamp),
      marketCapUsd,
      context,
    }),
    insertOrUpdateBuckets({
      poolAddress: address,
      price,
      timestamp,
      ethPrice,
      context,
    }),
  ]);

  await insertOrUpdateDailyVolume({
    poolAddress: address,
    amountIn,
    amountOut,
    timestamp,
    context,
    tokenIn,
    tokenOut,
    ethPrice,
    marketCapUsd,
  });
});
