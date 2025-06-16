import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getPools } from '@/gql/graphql';

export default function HomeScreen() {
    const { data: pools, error, isLoading } = useQuery({
        queryKey: ['pools'],
        queryFn: getPools
    });

    const getProgressPercent = (numerator: bigint, denominator: string) => {
        if (!denominator || denominator === '0') return 0;
        const num = Number(numerator);
        const denom = Number(denominator);
        return Math.min((num / denom) * 100, 100);
    };

    const formatBigIntToUsd = (value: bigint) => {
        return Math.round(Number(value) / 10 ** 18);
    };

    // Create mock data to fill the grid like in the image
    const mockTokens = Array.from({ length: 12 }, (_, i) => ({
        name: "This is fine",
        description: "The most fire meme on earth",
        creator: "h32b3...1f2ga",
        marketCap: "$2,649.57",
        image: "🔥",
        progress: Math.random() * 100
    }));

    return (
        <div className='min-h-screen bg-[#0F0F0F] text-white'>
            {/* Main Title Section */}
            <div className='text-center py-16'>
                <h1 className='text-7xl font-bold tracking-wider mb-4'>Pumpfun.fun</h1>
                <p className='text-2xl text-gray-400'>The Best Meme Fair Launch Platform on MOVE</p>
            </div>

            {/* Filter Controls */}
            <div className='flex justify-center gap-4 mb-12 px-8'>
                <div className='bg-[#1A1A1A] rounded-lg px-4 py-2 text-sm flex items-center gap-2 border border-gray-700'>
                    <span>🌐 Multichain</span>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
                    </svg>
                </div>
                <label className='bg-[#1A1A1A] rounded-lg px-4 py-2 text-sm flex items-center gap-2 cursor-pointer border border-gray-700'>
                    <input type='checkbox' className='w-4 h-4 rounded border-gray-600 bg-transparent' />
                    <span>Sort by Mcap</span>
                </label>
            </div>

            {/* Token Grid */}
            <div className='px-8 pb-16'>
                {isLoading && <div className='text-center text-gray-400 py-8'>Loading pools...</div>}
                {error && <div className='text-center text-red-500 py-8'>{(error as Error).message}</div>}

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
                    {(pools?.items || mockTokens).map((item, i) => {
                        const pool = pools?.items?.[i];
                        const mockToken = mockTokens[i];

                        return (
                            <div key={i} className='bg-[#1A1A1A] rounded-lg p-6 hover:bg-[#222] transition-colors border border-gray-800'>
                                {/* Token Header */}
                                <div className='mb-4'>
                                    <h3 className='text-xl font-bold text-white mb-1'>
                                        {pool?.baseToken?.name || mockToken?.name || "This is fine"}
                                    </h3>
                                    <p className='text-sm text-gray-400'>
                                        {pool?.baseToken?.symbol || mockToken?.description || "The most fire meme on earth"}
                                    </p>
                                </div>

                                {/* Token Image and Details */}
                                <div className='flex gap-4 mb-6'>
                                    <div className='w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center'>
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
                                    <div className='flex-1 space-y-2'>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-gray-400'>Created by</span>
                                            <span className='text-white font-mono'>
                                                {pool ?
                                                    `${pool.baseToken.address.slice(0, 6)}...${pool.baseToken.address.slice(-4)}` :
                                                    mockToken?.creator || "h32b3...1f2ga"
                                                }
                                            </span>
                                        </div>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-gray-400'>Market Cap</span>
                                            <span className='text-white font-semibold'>
                                                {pool ?
                                                    `$${formatBigIntToUsd(pool.asset.marketCapUsd || BigInt(0))}` :
                                                    mockToken?.marketCap || "$2,649.57"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className='mb-4'>
                                    <div className='h-2 bg-gray-700 rounded-full overflow-hidden'>
                                        <div
                                            className='h-full bg-[#7F4DFA] rounded-full transition-all duration-300'
                                            style={{
                                                width: `${pool ?
                                                    getProgressPercent(pool.liquidity, pool.asset.numTokensToSell) :
                                                    mockToken?.progress || 50
                                                    }%`
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-2'>
                                        <button className='w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors'>
                                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path d='M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z' />
                                            </svg>
                                        </button>
                                        <button className='w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors'>
                                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path d='M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z' />
                                            </svg>
                                        </button>
                                        <button className='w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors'>
                                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z' clipRule='evenodd' />
                                            </svg>
                                        </button>
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
