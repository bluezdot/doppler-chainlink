import { Address } from 'viem';

export interface Pool {
  address: string;
  chainId: bigint;
  tick: number;
  sqrtPrice: bigint;
  liquidity: string;
  createdAt: bigint;
  asset: Asset;
  baseToken: BaseToken;
  quoteToken: QuoteToken;
  price: bigint;
  fee: number;
  type: string;
  dollarLiquidity: bigint;
  dailyVolume: DailyVolume;
  volumeUsd: bigint;
  percentDayChange: number;
  totalFee0: bigint;
  totalFee1: bigint;
  graduationThreshold: bigint;
  graduationBalance: bigint;
  isToken0: boolean;
  lastRefreshed: bigint | null;
  lastSwapTimestamp: bigint | null;
  reserves0: string;
  reserves1: string;
  marketCapUsd?: bigint;
}

export interface Pools {
  items: Pool[];
}

export interface Asset {
  marketCapUsd: bigint;
  numTokensToSell: string;
}

export interface DailyVolume {
  volumeUsd: bigint;
}

export interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  creatorAddress: string;
}

export interface QuoteToken {
  address: string;
  name: string;
  symbol: string;
}

// ---
export type Trades = Trade[];

export interface Trade {
  amountIn: string;
  amountOut: string;
  txHash: string;
  timestamp: string;
  type: 'buy' | 'sell';
  usdPrice: string;
  user: string;
  asset: {
    address: string;
  };
}

// ---
export interface Holder {
  balance: string;
  user: {
    address: Address;
  };
}
