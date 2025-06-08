import { ponder } from "ponder:registry";
import { token, v2Pool } from "ponder.schema";
import {
  insertOrUpdateBuckets,
  insertOrUpdateDailyVolume,
  compute24HourPriceChange,
} from "./shared/timeseries";
import { computeV2Price } from "@app/utils/v2-utils/computeV2Price";
import { getPairData } from "@app/utils/v2-utils/getPairData";
import { computeDollarLiquidity } from "@app/utils/computeDollarLiquidity";
import { computeMarketCap, fetchEthPrice } from "./shared/oracle";
import {
  insertPoolIfNotExists,
  insertTokenIfNotExists,
  updateAsset,
  updatePool,
  updateV2Pool,
} from "./shared/entities";
import { CHAINLINK_ETH_DECIMALS } from "@app/utils/constants";
import { tryAddActivePool } from "./shared/scheduledJobs";
import { zeroAddress } from "viem";
import { configs } from "@app/types";
import { insertSwapIfNotExists } from "./shared/entities/swap";

ponder.on("UniswapV2Pair:Swap", async ({ event, context }) => {
  const { db, chain } = context;
  const { timestamp } = event.block;
  const { amount0In, amount1In, amount0Out, amount1Out } = event.args;

  const address = event.log.address.toLowerCase() as `0x${string}`;

  const v2PoolData = await db.find(v2Pool, { address });
  if (!v2PoolData) return;

  const parentPool = v2PoolData.parentPool.toLowerCase() as `0x${string}`;
  const { reserve0, reserve1 } = await getPairData({ address, context });

  const ethPrice = await fetchEthPrice(timestamp, context);

  const { isToken0, baseToken, quoteToken } = await insertPoolIfNotExists({
    poolAddress: parentPool,
    timestamp,
    context,
    ethPrice,
  });
  let v2isToken0 = isToken0;
  if (quoteToken.toLowerCase() == zeroAddress) {
    const weth = configs[chain.name].shared.weth.toLowerCase() as `0x${string}`;
    v2isToken0 = baseToken.toLowerCase() < weth.toLowerCase();
  }

  const amountIn = amount0In > 0 ? amount0In : amount1In;
  const amountOut = amount0Out > 0 ? amount0Out : amount1Out;
  const token0 = v2isToken0 ? baseToken : quoteToken;
  const token1 = v2isToken0 ? quoteToken : baseToken;

  const tokenIn = amount0In > 0 ? token0 : token1;
  const tokenOut = amount0In > 0 ? token1 : token0;

  const assetBalance = v2isToken0 ? reserve0 : reserve1;
  const quoteBalance = v2isToken0 ? reserve1 : reserve0;

  let type = "buy";
  if (v2isToken0 && amount0In > 0n) {
    type = "buy";
  } else if (!v2isToken0 && amount0In > 0n) {
    type = "sell";
  } else if (v2isToken0 && amount0In < 0n) {
    type = "sell";
  } else if (!v2isToken0 && amount0In < 0n) {
    type = "buy";
  }

  const price = computeV2Price({ assetBalance, quoteBalance });

  const { totalSupply } = await insertTokenIfNotExists({
    tokenAddress: baseToken,
    creatorAddress: address,
    timestamp,
    context,
    isDerc20: true,
  });

  const marketCapUsd = computeMarketCap({
    price,
    ethPrice,
    totalSupply,
  });

  const priceChange = await compute24HourPriceChange({
    poolAddress: address,
    marketCapUsd,
    context,
  });

  const liquidityUsd = computeDollarLiquidity({
    assetBalance,
    quoteBalance,
    price,
    ethPrice,
  });

  let quoteDelta = 0n;
  if (v2isToken0) {
    if (amount1In > 0n) {
      quoteDelta = amount1In;
    } else {
      quoteDelta = amount1Out;
    }
  } else {
    if (amount0In > 0n) {
      quoteDelta = amount0In
    } else {
      quoteDelta = amount0Out;
    }
  }
  const swapValueUsd = quoteDelta * ethPrice / CHAINLINK_ETH_DECIMALS;

  await Promise.all([
    tryAddActivePool({
      poolAddress: parentPool,
      lastSwapTimestamp: Number(timestamp),
      context,
    }),
    insertOrUpdateBuckets({
      poolAddress: parentPool,
      price,
      timestamp,
      ethPrice,
      context,
    }),
    insertOrUpdateDailyVolume({
      poolAddress: parentPool,
      amountIn,
      amountOut,
      timestamp,
      context,
      tokenIn,
      tokenOut,
      ethPrice,
      marketCapUsd,
    }),
    updateV2Pool({
      poolAddress: address,
      context,
      update: { price: (price * ethPrice) / CHAINLINK_ETH_DECIMALS },
    }),
    updateAsset({
      assetAddress: baseToken,
      context,
      update: {
        liquidityUsd: liquidityUsd,
        percentDayChange: priceChange,
        marketCapUsd,
      },
    }),
    insertSwapIfNotExists({
      txHash: event.transaction.hash,
      timestamp,
      context,
      pool: parentPool,
      asset: baseToken,
      chainId: BigInt(chain.id),
      type,
      user: event.transaction.from,
      amountIn,
      amountOut,
      usdPrice: swapValueUsd,
    }),
    updatePool({
      poolAddress: parentPool,
      context,
      update: {
        price,
        dollarLiquidity: liquidityUsd,
        lastRefreshed: timestamp,
        lastSwapTimestamp: timestamp,
        percentDayChange: priceChange,
        marketCapUsd,
      },
    }),
  ]);
});

ponder.on("UniswapV2PairUnichain:Swap", async ({ event, context }) => {
  const { db } = context;
  const { address } = event.log;
  const { timestamp } = event.block;
  const { amount0In, amount1In, amount0Out, amount1Out } = event.args;

  const v2PoolData = await db.find(v2Pool, { address });
  if (!v2PoolData) return;

  const { parentPool } = v2PoolData;

  const { reserve0, reserve1 } = await getPairData({ address, context });

  const ethPrice = await fetchEthPrice(timestamp, context);

  const { isToken0, baseToken, quoteToken } = await insertPoolIfNotExists({
    poolAddress: parentPool,
    timestamp,
    context,
    ethPrice,
  });

  const amountIn = amount0In > 0 ? amount0In : amount1In;
  const amountOut = amount0Out > 0 ? amount0Out : amount1Out;
  const token0 = isToken0 ? baseToken : quoteToken;
  const token1 = isToken0 ? quoteToken : baseToken;

  const tokenIn = amount0In > 0 ? token0 : token1;
  const tokenOut = amount0In > 0 ? token1 : token0;

  const assetBalance = isToken0 ? reserve0 : reserve1;
  const quoteBalance = isToken0 ? reserve1 : reserve0;

  const price = computeV2Price({ assetBalance, quoteBalance });

  const { totalSupply } = await insertTokenIfNotExists({
    tokenAddress: baseToken,
    creatorAddress: address,
    timestamp,
    context,
    isDerc20: true,
  });

  const marketCapUsd = computeMarketCap({
    price,
    ethPrice,
    totalSupply,
  });

  const priceChange = await compute24HourPriceChange({
    poolAddress: parentPool,
    marketCapUsd,
    context,
  });

  const liquidityUsd = await computeDollarLiquidity({
    assetBalance,
    quoteBalance,
    price,
    ethPrice,
  });

  await Promise.all([
    tryAddActivePool({
      poolAddress: parentPool,
      lastSwapTimestamp: Number(timestamp),
      context,
    }),
    insertOrUpdateBuckets({
      poolAddress: parentPool,
      price,
      timestamp,
      ethPrice,
      context,
    }),
    insertOrUpdateDailyVolume({
      poolAddress: parentPool,
      amountIn,
      amountOut,
      timestamp,
      context,
      tokenIn,
      tokenOut,
      ethPrice,
      marketCapUsd,
    }),
    updateV2Pool({
      poolAddress: address,
      context,
      update: { price: (price * ethPrice) / CHAINLINK_ETH_DECIMALS },
    }),
    updateAsset({
      assetAddress: baseToken,
      context,
      update: {
        liquidityUsd: liquidityUsd,
        percentDayChange: priceChange,
        marketCapUsd,
      },
    }),
    updatePool({
      poolAddress: parentPool,
      context,
      update: {
        price,
        dollarLiquidity: liquidityUsd,
        lastRefreshed: timestamp,
        lastSwapTimestamp: timestamp,
        percentDayChange: priceChange,
        marketCapUsd,
      },
    }),
  ]);
});
