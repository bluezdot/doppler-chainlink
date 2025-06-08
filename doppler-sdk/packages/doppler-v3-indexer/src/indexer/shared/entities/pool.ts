import { getV3PoolData } from "@app/utils/v3-utils";
import { getV4PoolData } from "@app/utils/v4-utils";
import { computeDollarLiquidity } from "@app/utils/computeDollarLiquidity";
import { pool } from "ponder:schema";
import { Address, zeroAddress } from "viem";
import { Context } from "ponder:registry";
import { computeMarketCap, fetchEthPrice } from "../oracle";
import { getReservesV4, V4PoolData } from "@app/utils/v4-utils/getV4PoolData";
import { getZoraPoolData, PoolState } from "@app/utils/v3-utils/getV3PoolData";
import { DERC20ABI } from "@app/abis";

export const fetchExistingPool = async ({
  poolAddress,
  context,
}: {
  poolAddress: Address;
  context: Context;
}): Promise<typeof pool.$inferSelect> => {
  const { db, chain } = context;
  const address = poolAddress.toLowerCase() as `0x${string}`;
  const existingPool = await db.find(pool, {
    address,
    chainId: BigInt(chain.id),
  });

  if (!existingPool) {
    throw new Error(`Pool ${address} not found in chain ${chain.id}`);
  }
  return existingPool;
};

export const insertPoolIfNotExists = async ({
  poolAddress,
  timestamp,
  context,
  ethPrice,
  update,
}: {
  poolAddress: Address;
  timestamp: bigint;
  context: Context;
  ethPrice: bigint;
  update?: Partial<typeof pool.$inferInsert>;
}): Promise<typeof pool.$inferSelect> => {
  const { db, chain, client } = context;
  const address = poolAddress.toLowerCase() as `0x${string}`;

  const existingPool = await db.find(pool, {
    address,
    chainId: BigInt(chain.id),
  });

  if (existingPool) {
    return existingPool;
  }

  const poolData = await getV3PoolData({
    address,
    context,
  });

  const { slot0Data, liquidity, price, fee, token0, poolState } = poolData;

  const isToken0 = token0.toLowerCase() === poolState.asset.toLowerCase();

  const assetAddr = poolState.asset.toLowerCase() as `0x${string}`;
  const numeraireAddr = poolState.numeraire.toLowerCase() as `0x${string}`;

  const assetTotalSupply = await client.readContract({
    address: assetAddr,
    abi: DERC20ABI,
    functionName: "totalSupply",
  });

  const marketCapUsd = computeMarketCap({
    price,
    ethPrice,
    totalSupply: assetTotalSupply,
  });

  return await db.insert(pool).values({
    ...poolData,
    ...slot0Data,
    address,
    liquidity: liquidity,
    createdAt: timestamp,
    asset: assetAddr,
    baseToken: assetAddr,
    quoteToken: numeraireAddr,
    price,
    type: "v3",
    chainId: BigInt(chain.id),
    fee,
    dollarLiquidity: 0n,
    dailyVolume: address,
    graduationThreshold: 0n,
    graduationBalance: 0n,
    totalFee0: 0n,
    totalFee1: 0n,
    volumeUsd: 0n,
    reserves0: 0n,
    reserves1: 0n,
    percentDayChange: 0,
    isToken0,
    marketCapUsd,
  });
};

export const updatePool = async ({
  poolAddress,
  context,
  update,
}: {
  poolAddress: Address;
  context: Context;
  update: Partial<typeof pool.$inferInsert>;
}) => {
  const { db, chain } = context;
  const address = poolAddress.toLowerCase() as `0x${string}`;

  await db
    .update(pool, {
      address,
      chainId: BigInt(chain.id),
    })
    .set({
      ...update,
    });
};

export const insertZoraPoolIfNotExists = async ({
  poolAddress,
  assetAddress,
  numeraireAddress,
  timestamp,
  context,
  ethPrice,
}: {
  poolAddress: Address;
  assetAddress: Address;
  numeraireAddress: Address;
  timestamp: bigint;
  context: Context;
  ethPrice: bigint;
}): Promise<typeof pool.$inferSelect> => {
  const { db, chain } = context;
  const address = poolAddress.toLowerCase() as `0x${string}`;

  const existingPool = await db.find(pool, {
    address,
    chainId: BigInt(chain.id),
  });

  if (existingPool) {
    return existingPool;
  }

  const poolState: PoolState = {
    asset: assetAddress,
    numeraire: numeraireAddress,
    tickLower: 0,
    tickUpper: 0,
    numPositions: 0,
    isInitialized: true,
    isExited: false,
    maxShareToBeSold: 0n,
    maxShareToBond: 0n,
    initializer: zeroAddress,
  };

  const poolData = await getZoraPoolData({
    address: poolAddress,
    context,
    assetAddress,
    numeraireAddress,
  });

  const { slot0Data, liquidity, price, fee, reserve0, reserve1, token0 } =
    poolData;

  const isToken0 = token0.toLowerCase() === poolState.asset.toLowerCase();

  const assetAddr = poolState.asset.toLowerCase() as `0x${string}`;
  const numeraireAddr = poolState.numeraire.toLowerCase() as `0x${string}`;

  let dollarLiquidity;
  if (ethPrice) {
    dollarLiquidity = await computeDollarLiquidity({
      assetBalance: isToken0 ? reserve0 : reserve1,
      quoteBalance: isToken0 ? reserve1 : reserve0,
      price,
      ethPrice,
    });
  }

  return await db.insert(pool).values({
    ...poolData,
    ...slot0Data,
    address,
    liquidity: liquidity,
    createdAt: timestamp,
    asset: assetAddr,
    baseToken: assetAddr,
    quoteToken: numeraireAddr,
    price,
    type: "v3",
    chainId: BigInt(chain.id),
    fee,
    dollarLiquidity: dollarLiquidity ?? 0n,
    dailyVolume: address,
    graduationThreshold: 0n,
    graduationBalance: 0n,
    totalFee0: 0n,
    totalFee1: 0n,
    volumeUsd: 0n,
    percentDayChange: 0,
    isToken0,
  });
};

export const insertPoolIfNotExistsV4 = async ({
  poolAddress,
  timestamp,
  poolData,
  context,
  totalSupply,
}: {
  poolAddress: Address;
  timestamp: bigint;
  poolData?: V4PoolData;
  context: Context;
  totalSupply?: bigint;
}): Promise<typeof pool.$inferSelect> => {
  const { db, chain, client } = context;
  const address = poolAddress.toLowerCase() as `0x${string}`;
  const existingPool = await db.find(pool, {
    address,
    chainId: BigInt(chain.id),
  });

  if (existingPool) {
    return existingPool;
  }

  if (!poolData) {
    poolData = await getV4PoolData({
      hook: address,
      context,
    });
  }

  const { poolKey, slot0Data, liquidity, price, poolConfig } = poolData;
  const { fee } = poolKey;

  const { token0Reserve, token1Reserve } = await getReservesV4({
    hook: address,
    context,
  });

  const assetAddr = poolConfig.isToken0 ? poolKey.currency0 : poolKey.currency1;
  const numeraireAddr = poolConfig.isToken0
    ? poolKey.currency1
    : poolKey.currency0;

  const ethPrice = await fetchEthPrice(timestamp, context);

  const assetBalance = poolConfig.isToken0 ? token0Reserve : token1Reserve;
  const quoteBalance = poolConfig.isToken0 ? token1Reserve : token0Reserve;

  const dollarLiquidity = await computeDollarLiquidity({
    assetBalance,
    quoteBalance,
    price,
    ethPrice,
  });

  const assetTotalSupply = await client.readContract({
    address: assetAddr,
    abi: DERC20ABI,
    functionName: "totalSupply",
  });
  const marketCapUsd = computeMarketCap({
    price,
    ethPrice,
    totalSupply: assetTotalSupply,
  });

  return await db.insert(pool).values({
    ...poolData,
    ...slot0Data,
    address,
    chainId: BigInt(chain.id),
    tick: slot0Data.tick,
    sqrtPrice: slot0Data.sqrtPrice,
    liquidity: liquidity,
    createdAt: timestamp,
    asset: assetAddr,
    baseToken: assetAddr,
    quoteToken: numeraireAddr,
    price,
    fee,
    type: "v4",
    dollarLiquidity: dollarLiquidity ?? 0n,
    dailyVolume: address,
    volumeUsd: 0n,
    percentDayChange: 0,
    totalFee0: 0n,
    totalFee1: 0n,
    graduationThreshold: 0n,
    graduationBalance: 0n,
    isToken0: poolConfig.isToken0,
    marketCapUsd,
    reserves0: token0Reserve,
    reserves1: token1Reserve,
    poolKey: JSON.stringify(poolKey),
  });
};
