import { GraphQLClient } from 'graphql-request';
import { GET_POOL_QUERY, GET_POOLS_QUERY } from '@/gql/query';
import { Address } from 'viem';
import { Pool, Pools } from '@/gql/interface';
import { INDEXER_URL } from '@/config';

export const client = new GraphQLClient(INDEXER_URL);

export const getPools = async (): Promise<Pools> => {
    const response = await client.request<{ pools: Pools }>(GET_POOLS_QUERY);
    return response.pools;
};

export const getPool = async (address: Address, chainId: number): Promise<Pool> => {
    const response = await client.request<{ pool: Pool }>(GET_POOL_QUERY, { address, chainId: BigInt(chainId).toString() });
    return response.pool;
};
