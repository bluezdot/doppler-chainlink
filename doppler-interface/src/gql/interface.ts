export interface Pool {
  address: string;
  chainId: bigint;
  tick: number;
  sqrtPrice: bigint;
  liquidity: bigint;
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
  reserves0: bigint;
  reserves1: bigint;
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
}

export interface QuoteToken {
  address: string;
  name: string;
  symbol: string;
}

// ---

export interface Positions {

}
