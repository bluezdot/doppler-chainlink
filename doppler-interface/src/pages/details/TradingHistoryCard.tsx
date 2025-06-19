interface TradeEntry {
  address: string;
  type: 'Buy' | 'Sell';
  amount: string;
  time: string;
  transaction: string;
  // todo: symbol
}

interface Props {
  trades: TradeEntry[];
}

export default function TradingHistoryCard() {
  // Sample trading data
  const trades: TradeEntry[] = [
    {
      address: '3xwyd...f23dd',
      type: 'Buy',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Sell',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Sell',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Buy',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Sell',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Buy',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Sell',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Buy',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Sell',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    },
    {
      address: '3xwyd...f23dd',
      type: 'Buy',
      amount: '0.3823 SOL',
      time: '12m ago',
      transaction: 'e21wh9'
    }
  ];

  return (
      <div className='p-6' style={{backgroundColor: '#1A1A1A', borderRadius: '12px'}}>
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
                  <div className='text-gray-300'>{trade.address}</div>
                  <div className={trade.type === 'Buy' ? 'text-green-400' : 'text-purple-400'}>
                    {trade.type}
                  </div>
                  <div className='text-gray-300'>{trade.amount}</div>
                  <div className='text-gray-400'>{trade.time}</div>
                  <div className='text-gray-400'>{trade.transaction}</div>
                </div>
            ))}
          </div>
        </div>
        );
        }
