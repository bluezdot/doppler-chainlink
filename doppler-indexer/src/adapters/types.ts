import { Address } from "viem";
import { Context } from "ponder:registry";
import { SwapType } from "@app/types/shared";
import { Chain } from "viem";

/**
 * Common event data structure for all protocol events
 */
export interface BaseEventData {
  address: Address;
  chain: Chain;
  timestamp: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  transactionFrom: Address;
}

/**
 * Pool creation event data
 */
export interface PoolCreateEventData extends BaseEventData {
  poolAddress: Address;
  assetAddress: Address;
  numeraireAddress: Address;
  creatorAddress: Address;
}

/**
 * Swap event data common across all protocols
 */
export interface SwapEventData extends BaseEventData {
  poolAddress: Address;
}

/**
 * V2-specific swap event data
 */
export interface V2SwapEventData extends SwapEventData {
  amount0In: bigint;
  amount1In: bigint;
  amount0Out: bigint;
  amount1Out: bigint;
}

/**
 * V3-specific swap event data
 */
export interface V3SwapEventData extends SwapEventData {
  amount0: bigint;
  amount1: bigint;
  sqrtPriceX96: bigint;
  tick: bigint;
  liquidity: bigint;
}

/**
 * V4-specific swap event data
 */
export interface V4SwapEventData extends SwapEventData {
  currentTick: number;
  totalProceeds: bigint;
  totalTokensSold: bigint;
}

/**
 * Pool data retrieved from blockchain
 */
export interface PoolData {
  isToken0: boolean;
  baseToken: Address;
  quoteToken: Address;
  reserves0: bigint;
  reserves1: bigint;
  liquidity: bigint;
  price: bigint;
}

/**
 * Protocol-specific pool data
 */
export interface V2PoolData extends PoolData {
  token0: Address;
  token1: Address;
}

export interface V3PoolData extends PoolData {
  sqrtPriceX96: bigint;
  tick: number;
  fee: number;
  totalFee0: bigint;
  totalFee1: bigint;
  graduationBalance: bigint;
}

export interface V4PoolData extends PoolData {
  currentTick: number;
  totalProceeds: bigint;
  totalTokensSold: bigint;
}

/**
 * Swap processing result
 */
export interface SwapResult {
  type: SwapType;
  amountIn: bigint;
  amountOut: bigint;
  tokenIn: Address;
  tokenOut: Address;
  price: bigint;
  swapValueUsd: bigint;
  protocolSpecificData?: any;
}

/**
 * Base protocol adapter interface
 */
export interface IProtocolAdapter {
  /**
   * Process a pool creation event
   */
  handlePoolCreate(
    event: PoolCreateEventData,
    context: Context
  ): Promise<void>;

  /**
   * Process a swap event and return normalized swap data
   */
  handleSwap(
    event: SwapEventData,
    context: Context
  ): Promise<SwapResult>;

  /**
   * Get current pool data
   */
  getPoolData(
    poolAddress: Address,
    context: Context
  ): Promise<PoolData>;

  /**
   * Calculate price based on protocol-specific logic
   */
  calculatePrice(poolData: PoolData): bigint;

  /**
   * Protocol-specific liquidity provision handling
   */
  handleLiquidityChange?(
    event: BaseEventData & { liquidity: bigint },
    context: Context
  ): Promise<void>;
}

/**
 * V2-specific adapter interface
 */
export interface IV2Adapter extends IProtocolAdapter {
  handleSwap(event: V2SwapEventData, context: Context): Promise<SwapResult>;
  getPoolData(poolAddress: Address, context: Context): Promise<V2PoolData>;
}

/**
 * V3-specific adapter interface
 */
export interface IV3Adapter extends IProtocolAdapter {
  handleSwap(event: V3SwapEventData, context: Context): Promise<SwapResult>;
  getPoolData(poolAddress: Address, context: Context): Promise<V3PoolData>;
  handleMint?(
    event: BaseEventData & {
      tickLower: number;
      tickUpper: number;
      amount: bigint;
      amount0: bigint;
      amount1: bigint;
    },
    context: Context
  ): Promise<void>;
  handleBurn?(
    event: BaseEventData & {
      chainId: number;
      tickLower: number;
      tickUpper: number;
      amount: bigint;
      amount0: bigint;
      amount1: bigint;
    },
    context: Context
  ): Promise<void>;
}

/**
 * V4-specific adapter interface
 */
export interface IV4Adapter extends IProtocolAdapter {
  handleSwap(event: V4SwapEventData, context: Context): Promise<SwapResult>;
  getPoolData(poolAddress: Address, context: Context): Promise<V4PoolData>;
}

/**
 * Adapter configuration
 */
export interface AdapterConfig {
  chainId: number;
  protocolVersion: "v2" | "v3" | "v4";
  contracts: {
    factory?: Address;
    poolManager?: Address;
    stateView?: Address;
  };
}

/**
 * Factory interface for creating protocol adapters
 */
export interface IAdapterFactory {
  createAdapter(config: AdapterConfig): IProtocolAdapter;
}