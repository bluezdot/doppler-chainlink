import { Button } from '@/components/ui/button';
import { usePools } from '@/services/indexer';

export default function HomeScreen() {
  const {
    data: pools,
    error,
    isLoading
  } = usePools('createdAt', 'desc', 10, { chainId: '84532', type: 'v3' });

  console.log('pools', pools, error, isLoading);

  const getProgressPercent = (numerator: string, denominator: string) => {
    return denominator ? Math.min(Number((numerator / denominator) * 100), 100) : 0;
  };

  // todo: get24HChange
  const getRandom24HChange = () => {
    const change = (Math.random() * 20 - 10).toFixed(2); // Random between -10% and +10%
    return {
      value: change,
      isPositive: parseFloat(change) > 0
    };
  };

  return (
    <div className='min-h-screen bg-[#0F0F0F] text-white p-8'>
      <header className='flex justify-between items-center mb-16'>
        <div className='flex items-center gap-2'>
          <span className='w-4 h-4 rounded-full bg-[#7F4DFA]'></span>
          <span className='text-lg font-bold tracking-wider'>LEVEL</span>
        </div>
        <div className='flex gap-3'>
          <Button variant='outline'>Connect</Button>
          <Button>Launch App</Button>
        </div>
      </header>
      <div className='text-center mb-10'>
        <h1 className='text-6xl font-bold tracking-wider mb-2'>BumpX.org</h1>
        <p className='text-2xl text-gray-500'>The Best Meme Fair Launch Platform on Ethereum</p>
      </div>
      <div className='flex justify-center gap-4 mb-12 flex-wrap'>
        <span className='bg-[#1A1A1A] rounded px-3 py-2 text-sm'>Multi Chain</span>
        <span className='bg-[#1A1A1A] rounded px-3 py-2 text-sm flex items-center gap-2'>
          <input type='checkbox' className='form-checkbox rounded-sm' />
          <span>Verified Only</span>
        </span>
      </div>
      {isLoading && <div className='text-center text-muted-foreground'>Loading pools...</div>}
      {error && <div className='text-center text-red-500'>{(error as Error).message}</div>}
      <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {pools?.pools?.items?.map((pool, i) => (
          <div key={i} className='bg-[#1A1A1A] rounded-lg p-5 flex flex-col gap-4'>
            <div>
              <h3 className='text-xl font-bold tracking-wide'>${pool.baseToken.name}/ETH</h3>
              <p className='text-sm text-gray-400'>Some description</p>
            </div>
            <div className='flex gap-4'>
              <div className='w-28 h-28 bg-gray-700 rounded' />
              <div className='flex flex-col flex-1 gap-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Market Cap</span>
                  <span>${Math.round(Number(pool.asset.marketCapUsd / 10 ** 18))}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Liquidity</span>
                  <span>${Math.round(Number(pool.dollarLiquidity / 10 ** 18))}</span>
                </div>
                <div className='mt-auto'>
                  <div className='h-1 bg-gray-700 rounded-full'>
                    <div
                      className='h-1 bg-[#7F4DFA] rounded-full'
                      style={{
                        width: `${getProgressPercent(pool.liquidity, pool.asset.numTokensToSell)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
