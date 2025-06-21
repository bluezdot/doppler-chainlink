import { useQuery } from '@tanstack/react-query';
import { getPools } from '@/gql/graphql';
import websiteIcon from '../assets/icons/website.svg';
import twitterIcon from '../assets/icons/twitter.svg';
import telegramIcon from '../assets/icons/telegram.svg';
import { useNavigate } from 'react-router-dom';
import { formatBigIntToUsd, getProgressPercent } from '@/utils/utils';
import { useMemo } from 'react';

// todo: progess bar

export default function HomeScreen() {
  const navigate = useNavigate();

  const {
    data: pools,
    error,
    isLoading
  } = useQuery({
    queryKey: ['pools'],
    queryFn: getPools
  });

  useMemo(() => {
    console.log('pools', pools);
  }, [pools]);

  // Create mock data to fill the grid like in the image
  const mockTokens = Array.from({ length: 12 }, (_, i) => ({
    address: '0x1e24e7109c088fc802ff222dd76a446ba82e0e07',
    name: 'This is fine',
    description: 'The most fire meme on earth',
    creator: 'h32b3...1f2ga',
    marketCap: '$2,649.57',
    image: '🔥',
    progress: Math.random() * 100
  }));

  const handleViewPool = (poolAddress: string) => {
    navigate(`/doppler-v2/${poolAddress}`);
  };

  return (
    <div className='min-h-screen bg-[#0F0F0F] text-white'>
      {/* Main Title Section */}
      <div className='text-center py-16'>
        <h1 className='text-7xl font-bold tracking-wider mb-4'>SafeLynx</h1>
        <p className='text-2xl text-gray-400'>Champion Chainlink Hackathon 2025</p>
      </div>
      {/*Filter Controls*/}
      <div className='flex justify-center gap-4 mb-12 px-8'>
        <div className='bg-[#1A1A1A] rounded-lg px-4 py-2 text-sm flex items-center gap-2 border border-gray-700'>
          <span>🌐 Multichain</span>
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <label className='bg-[#1A1A1A] rounded-lg px-4 py-2 text-sm flex items-center gap-2 cursor-pointer border border-gray-700'>
          <input type='checkbox' className='w-4 h-4 rounded border-gray-600 bg-transparent' />
          <span>Sort by market cap</span>
        </label>
      </div>
      {/* Token Grid */}
      <div className='px-8 pb-16'>
        {isLoading && <div className='text-center text-gray-400 py-8'>Loading real pools...</div>}
        {error && (
          <div className='text-center text-red-500 py-8'>
            {(error as Error).message} - Displaying demo pools
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
          {(pools?.items || mockTokens).map((item, i) => {
            const pool = pools?.items?.[i];
            const mockToken = mockTokens[i];

            return (
              <div
                key={i}
                className='bg-[#1A1A1A] rounded-lg p-6 hover:bg-[#222] transition-colors border border-gray-800'
                onClick={() => handleViewPool(pool?.address || mockToken?.address)}
              >
                {/* Token Header */}
                <div className='mb-4'>
                  <h3 className='text-xl font-bold text-white mb-1'>
                    {pool?.baseToken?.name || mockToken?.name || 'This is fine'}
                  </h3>
                  <p className='text-sm text-gray-400'>
                    {pool?.baseToken?.symbol ||
                      mockToken?.description ||
                      'The most fire meme on earth'}
                  </p>
                </div>

                {/* Token Image and All Details */}
                <div className='flex gap-4'>
                  <div className='w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center'>
                    {pool?.baseToken?.image ? (
                      <img
                        src={pool.baseToken.image}
                        alt={pool.baseToken.name}
                        className='w-full h-full object-cover rounded-lg'
                      />
                    ) : (
                      <span className='text-3xl'>🔥</span>
                    )}
                  </div>

                  {/* Right Side Content */}
                  <div className='flex-1 space-y-4'>
                    {/* Created by and Market Cap */}
                    <div className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-400'>Created by</span>
                        <span className='text-white font-mono'>
                          {pool
                            ? `${pool.baseToken.address.slice(0, 6)}...${pool.baseToken.address.slice(-4)}`
                            : mockToken?.creator}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-400'>Market Cap</span>
                        <span className='text-white font-semibold'>
                          {pool
                            ? `$${formatBigIntToUsd(pool.asset.marketCapUsd || BigInt(0))}`
                            : mockToken?.marketCap}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-[#7F4DFA] rounded-full transition-all duration-300'
                          style={{
                            width: `${
                              pool
                                ? getProgressPercent(pool.liquidity, pool.asset.numTokensToSell)
                                : mockToken?.progress || 50
                            }%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex justify-end'>
                      <div className='flex gap-2'>
                        <button className='w-8 h-8 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors'>
                          <img src={websiteIcon} alt='website' className='w-4 h-4' />
                        </button>
                        <button className='w-8 h-8 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors'>
                          <img src={twitterIcon} alt='twitter' className='w-4 h-4' />
                        </button>
                        <button className='w-8 h-8 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors'>
                          <img src={telegramIcon} alt='telegram' className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
