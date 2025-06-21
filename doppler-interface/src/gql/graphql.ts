import { GraphQLClient } from 'graphql-request';
import { GET_HISTORIES_QUERY, GET_POOL_QUERY, GET_POOLS_QUERY, GET_TOP_HOLDERS } from '@/gql/query';
import { Address } from 'viem';
import { Holder, Pool, Pools, Trades } from '@/gql/interface';
import { INDEXER_URL } from '@/config';

export const client = new GraphQLClient(INDEXER_URL);

export const getPools = async (): Promise<Pools> => {
  const response = await client.request<{ pools: Pools }>(GET_POOLS_QUERY);
  return response.pools;
};

export const getPool = async (address: Address, chainId: number): Promise<Pool> => {
  const response = await client.request<{ pool: Pool }>(GET_POOL_QUERY, {
    address,
    chainId: BigInt(chainId).toString()
  });
  return response.pool;
};

export const getTrades = async (address: Address, chainId: number): Promise<Trades> => {
  const response = await client.request<{ swaps: { items: Trades } }>(GET_HISTORIES_QUERY, {
    address,
    chainId: BigInt(chainId).toString()
  });
  return response.swaps.items;
};

export const getTopHolders = async (address: Address, chainId: number): Promise<Holder[]> => {
  const response = await client.request<{ userAssets: { items: Holder[] } }>(GET_TOP_HOLDERS, {
    address,
    chainId: BigInt(chainId).toString()
  });

  return response.userAssets.items;
};
