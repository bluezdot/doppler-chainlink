'use client';

import { Copy, Plus } from 'lucide-react';

export default function TokenInfoCard() {
  const tokenData = {
    name: 'This is fine',
    logo: '/placeholder.svg?height=80&width=80',
    contractAddress: 'h32b3...1f2ga',
    createdBy: 'h32b3...1f2ga',
    price: '0.000000003321321 SOL',
    marketCap: '$2,205.80',
    virtualLiquidity: '$2463.22',
    volume24h: '403.42 SOL'
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className='bg-gray-900 rounded-lg p-6'>
      {/* Header Section */}
      <div className='flex items-start gap-4 mb-6'>
        {/* Token Logo */}
        <div className='w-20 h-20 rounded-lg overflow-hidden flex-shrink-0'>
          <img
            src={tokenData.logo || '/placeholder.svg'}
            alt={tokenData.name}
            className='w-full h-full object-cover'
          />
        </div>

        {/* Token Name and Social Icons */}
        <div className='flex-1'>
          <h1 className='text-white text-4xl font-bold mb-3'>{tokenData.name}</h1>

          {/* Social Icons */}
          <div className='flex items-center gap-3'>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <Plus className='w-4 h-4 text-gray-400' />
            </button>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <span className='text-gray-400 text-xs font-bold'>X</span>
            </button>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <span className='text-gray-400 text-xs font-bold'>f</span>
            </button>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <span className='text-gray-400 text-xs'>📱</span>
            </button>
            <button className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors'>
              <span className='text-gray-400 text-xs'>✈️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Token Details Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Contract Address */}
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-blue-400 text-sm'>{tokenData.contractAddress}</span>
            <button
              onClick={() => handleCopyAddress(tokenData.contractAddress)}
              className='text-gray-400 hover:text-white transition-colors'
            >
              <Copy className='w-4 h-4' />
            </button>
          </div>
          <div className='text-gray-500 text-xs'>Contract</div>
        </div>

        {/* Price */}
        <div>
          <div className='text-white text-lg font-semibold mb-1'>{tokenData.price}</div>
          <div className='text-gray-500 text-xs'>Price</div>
        </div>

        {/* Market Cap */}
        <div>
          <div className='text-white text-lg font-semibold mb-1'>{tokenData.marketCap}</div>
          <div className='text-gray-500 text-xs'>Market Cap</div>
        </div>

        {/* Created By */}
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-blue-400 text-sm'>{tokenData.createdBy}</span>
            <button
              onClick={() => handleCopyAddress(tokenData.createdBy)}
              className='text-gray-400 hover:text-white transition-colors'
            >
              <Copy className='w-4 h-4' />
            </button>
          </div>
          <div className='text-gray-500 text-xs'>Created by</div>
        </div>

        {/* Virtual Liquidity */}
        <div>
          <div className='text-white text-lg font-semibold mb-1'>{tokenData.virtualLiquidity}</div>
          <div className='text-gray-500 text-xs'>Virtual Liquidity</div>
        </div>

        {/* 24h Volume */}
        <div>
          <div className='text-white text-lg font-semibold mb-1'>{tokenData.volume24h}</div>
          <div className='text-gray-500 text-xs'>24h Volume</div>
        </div>
      </div>
    </div>
  );
}
