import { useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';
import {
  AssetsDocument,
  AssetsQuery,
  TokenQuery,
  AssetQuery,
  PositionsQuery,
  PoolsQuery,
  PoolFilter
} from '../gql/graphql';
import { AssetDocument, PositionsDocument, TokenDocument, PoolsDocument } from './documents';
import { INDEXER_URL } from '@/config';

export const useToken = (address: string) =>
  useQuery<TokenQuery>({
    queryKey: ['indexer', 'token', address],
    queryFn: () => request(INDEXER_URL, TokenDocument, { address })
  });

export const useAssets = (poolInitializer?: string) =>
  useQuery<AssetsQuery>({
    queryKey: ['indexer', 'assets', poolInitializer],
    queryFn: () =>
      request(INDEXER_URL, AssetsDocument, {
        poolInitializer: poolInitializer?.toLowerCase()
      })
  });

export const useAsset = (address: string) =>
  useQuery<AssetQuery>({
    queryKey: ['indexer', 'asset', address],
    queryFn: () => request(INDEXER_URL, AssetDocument, { address })
  });

export const usePositions = (pool: string | undefined) =>
  useQuery<PositionsQuery>({
    queryKey: ['indexer', 'positions', pool],
    queryFn: () => {
      if (!pool) throw new Error('Pool address required');
      return request(INDEXER_URL, PositionsDocument, { pool });
    },
    enabled: !!pool
  });

export const usePools = (
  orderBy: string = 'createdAt',
  orderDirection: string = 'desc',
  limit: number = 10,
  where?: PoolFilter
) =>
  useQuery<PoolsQuery>({
    queryKey: ['indexer', 'pools', orderBy, orderDirection, limit, where],
    queryFn: () =>
      request(INDEXER_URL, PoolsDocument, {
        orderBy,
        orderDirection,
        limit,
        where
      })
  });
