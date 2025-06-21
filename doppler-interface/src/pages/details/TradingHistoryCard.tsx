import { useQuery } from '@tanstack/react-query';
import { getTrades, Trades } from '@/gql';
import { Address } from 'viem';
import { useParams } from 'react-router-dom';
import { shortenAddress, timestampToMinutesAgo } from '@/utils/utils';

const chainId = 84532;

interface Props {
  symbol: string;
}

function formatAmount(amount: string) {
  return parseFloat((Number(amount) / 10 ** 18).toFixed(3));
}

export default function TradingHistoryCard(props: Props) {
  const { id } = useParams();

  const {
    data: trades,
    error,
    isLoading
  } = useQuery({
    queryKey: ['trades', '0xb60558c2695e3644eeb6d86a10505a5059334c38', chainId],
    queryFn: async () => getTrades('0xb60558c2695e3644eeb6d86a10505a5059334c38' as Address, chainId)
  });

  // Sample trading data
  const defaultTrades: Trades = [
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'buy',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'buy',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'buy',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'sell',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'buy',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'sell',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'buy',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'buy',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'sell',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      amountIn: '1000000000000000',
      amountOut: '-4561691041986190892370636',
      txHash: '0x3fd60300ec95b729653a51269955b49f3cb65f49ae408e88820bf6cc8a4d61e0',
      timestamp: '1750337216',
      type: 'buy',
      usdPrice: '2529211192610000000',
      user: '0x95a3b728b4ce482bc894cfa34d798ba570180c00',
      asset: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    }
  ];

  return (
    !isLoading &&
    !error && (
      <div className='p-6' style={{ backgroundColor: '#1A1A1A', borderRadius: '12px' }}>
        {/* Title */}
        <h2 className='text-white text-2xl font-bold mb-6'>Trading History</h2>

        {/* Table Header */}
        <div className='grid grid-cols-5 gap-4 mb-4 text-gray-400 text-sm font-medium'>
          <div>Address</div>
          <div>Type</div>
          <div>Amount</div>
          <div>Time</div>
          <div>Transaction</div>
        </div>

        {/* Table Rows */}
        <div className='space-y-3'>
          {trades.map((trade, index) => (
            <div key={index} className='grid grid-cols-5 gap-4 text-sm'>
              <div className='text-gray-300'>{shortenAddress(trade.asset.address)}</div>
              <div className={trade.type === 'buy' ? 'text-green-400' : 'text-purple-400'}>
                {trade.type === 'buy' ? 'Buy' : 'Sell'}
              </div>
              <div className='text-gray-300'>
                {formatAmount(trade.amountIn)} {props.symbol}
              </div>
              <div className='text-gray-400'>{timestampToMinutesAgo(trade.timestamp)}</div>
              <div className='text-gray-400'>{shortenAddress(trade.txHash)}</div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
