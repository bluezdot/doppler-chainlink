export const GET_POOLS_QUERY = `
  query Pools {
    pools(orderBy: "createdAt", orderDirection: "desc", where: { type: "v3" }) {
      items {
        address
        chainId
        tick
        sqrtPrice
        liquidity
        createdAt
        baseToken {
          address
          name
          symbol
          image
          creatorAddress
        }
        quoteToken {
          address
          name
          symbol
        }
        price
        fee
        type
        dollarLiquidity
        dailyVolume {
          volumeUsd
        }
        asset {
          marketCapUsd
          numTokensToSell
        }
        volumeUsd
        percentDayChange
        totalFee0
        totalFee1
        graduationThreshold
        graduationBalance
        isToken0
        lastRefreshed
        lastSwapTimestamp
        reserves0
        reserves1
      }
    }
  }
`;

export const GET_POOL_QUERY = `
  query GetPool($address: String!, $chainId: BigInt!) {
    pool(address: $address, chainId: $chainId) {
      address
      chainId
      tick
      sqrtPrice
      liquidity
      createdAt
      asset {
        marketCapUsd
        numTokensToSell
      }
      baseToken {
        address
        name
        symbol
        image
        creatorAddress
      }
      quoteToken {
        address
        name
        symbol
      }
      price
      fee
      type
      dollarLiquidity
      dailyVolume {
        volumeUsd
      }
      volumeUsd
      percentDayChange
      totalFee0
      totalFee1
      graduationThreshold
      graduationBalance
      isToken0
      lastRefreshed
      lastSwapTimestamp
      reserves0
      reserves1
      marketCapUsd
    }
  }
`;

export const GET_HISTORIES_QUERY = `
    query SwapHistoryByPool($address: String!, $chainId: BigInt!) {
      swaps(
        limit: 10
        where: {pool: $address, chainId: $chainId}
      ) {
        items {
          amountIn
          amountOut
          txHash
          timestamp
          type
          usdPrice
          user
          asset {
            address
          }
        }
      }
    }
`;

export const GET_TOP_HOLDERS = `
    query GetTopHoldersByAssetID($address: String!, $chainId: BigInt!) {
      userAssets(
        where: {assetId: $address, chainId: $chainId}
        limit: 10
        orderBy: "balance"
        orderDirection: "desc"
      ) {
        items {
          balance
          user {
            address
          }
        }
      }
    }
`;
