'use client';

import { Copy, Globe, MessageSquare, Send } from 'lucide-react';
import { Pool } from '@/gql';
import { formatBigIntToUsd } from '@/utils/utils';
import {
  DiscordLogo,
  FacebookLogo,
  TelegramLogo,
  WebsiteLogo,
  XLogo
} from '@/components/logo/social-logo';

interface Props {
  poolInfo: Pool;
}

export default function TokenInfoCard(props: Props) {
  const { poolInfo } = props;

  const defaultPoolInfo = {
    address: 'h32b3...1f2ga',
    chainId: '',
    tick: 0,
    sqrtPrice: '0',
    liquidity: '$2463.22', // todo
    createdAt: '',
    price: '0.000000003321321', // todo
    fee: 0,
    type: '',
    dollarLiquidity: '0',
    volumeUsd: '0',
    percentDayChange: 0,
    totalFee0: '0',
    totalFee1: '0',
    graduationThreshold: '0',
    graduationBalance: '0',
    isToken0: false,
    lastRefreshed: null,
    lastSwapTimestamp: null,
    reserves0: '0',
    reserves1: '0',
    marketCapUsd: '$2,205.80', // todo
    asset: {
      marketCapUsd: '0'
    },
    dailyVolume: {
      volumeUsd: '403.42 SOL' // todo
    },
    baseToken: {
      address: '',
      name: 'This is fine',
      symbol: '',
      image: '/images/DefaultLogo.png',
      creatorAddress: 'h32b3...1f2ga'
    },
    quoteToken: {
      address: '',
      name: '',
      symbol: ''
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const shortenAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  return (
    <div className='bg-gray-900 rounded-lg p-6'>
      {/* Header Section */}
      <div className='flex items-start gap-4 mb-6'>
        {/* Token Logo */}
        <div className='w-30 h-30 rounded-lg overflow-hidden flex-shrink-0'>
          <img
            // src={poolInfo?.baseToken?.image || defaultPoolInfo.baseToken.image}
            src={defaultPoolInfo.baseToken.image}
            alt={poolInfo?.baseToken?.name || defaultPoolInfo.baseToken.name}
            className='w-full h-full object-cover'
          />
        </div>

        {/* Token Name and Social Icons */}
        <div className='flex-1'>
          <h1 className='text-white text-4xl font-bold mb-3'>
            {poolInfo?.baseToken?.name || defaultPoolInfo.baseToken.name}
          </h1>

          {/* Social Icons */}
          <div className='flex items-center gap-3'>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <WebsiteLogo className='w-4 h-4 text-gray-400' />
            </button>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <XLogo className='w-4 h-4 text-gray-400' />
            </button>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <FacebookLogo className='w-4 h-4 text-gray-400' />
            </button>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <DiscordLogo className='w-4 h-4 text-gray-400' />
            </button>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <TelegramLogo className='w-4 h-4 text-gray-400' />
            </button>
          </div>
        </div>
      </div>

      {/* Token Details Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Contract Address */}
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-blue-400 text-sm'>
              {shortenAddress(poolInfo?.address || defaultPoolInfo.address)}
            </span>
            <button
              onClick={() => handleCopyAddress(poolInfo?.address || defaultPoolInfo.address)}
              className='text-gray-400 hover:text-white transition-colors'
            >
              <Copy className='w-4 h-4' />
            </button>
          </div>
          <div className='text-gray-500 text-xs'>Contract</div>
        </div>

        {/* Price */}
        <div>
          <div className='text-white text-lg font-semibold mb-1'>
            {poolInfo?.price && poolInfo?.quoteToken?.symbol
              ? `${formatBigIntToUsd(poolInfo?.price)} ${poolInfo?.quoteToken?.symbol}`
              : `${formatBigIntToUsd(defaultPoolInfo?.price)} ${defaultPoolInfo?.quoteToken?.symbol}`}
          </div>
          <div className='text-gray-500 text-xs'>Price</div>
        </div>

        {/* Market Cap */}
        <div>
          <div className='text-white text-lg font-semibold mb-1'>
            {poolInfo?.asset?.marketCapUsd || defaultPoolInfo.asset.marketCapUsd}
          </div>
          <div className='text-gray-500 text-xs'>Market Cap</div>
        </div>

        {/* Created By */}
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-blue-400 text-sm'>
              {shortenAddress(
                poolInfo?.baseToken?.creatorAddress || defaultPoolInfo.baseToken.creatorAddress
              )}
            </span>
            <button
              onClick={() =>
                handleCopyAddress(
                  poolInfo?.baseToken?.creatorAddress || defaultPoolInfo.baseToken.creatorAddress
                )
              }
              className='text-gray-400 hover:text-white transition-colors'
            >
              <Copy className='w-4 h-4' />
            </button>
          </div>
          <div className='text-gray-500 text-xs'>Created by</div>
        </div>

        {/* Virtual Liquidity */}
        <div>
          <div className='text-white text-lg font-semibold mb-1'>
            {`${formatBigIntToUsd(poolInfo?.liquidity || defaultPoolInfo.liquidity)} $`}
          </div>
          <div className='text-gray-500 text-xs'>Virtual Liquidity</div>
        </div>

        {/* 24h Volume */}
        <div>
          <div className='text-white text-lg font-semibold mb-1'>
            {poolInfo?.dailyVolume?.volumeUsd || defaultPoolInfo.dailyVolume.volumeUsd}
          </div>
          <div className='text-gray-500 text-xs'>24h Volume</div>
        </div>
      </div>
    </div>
  );
}
