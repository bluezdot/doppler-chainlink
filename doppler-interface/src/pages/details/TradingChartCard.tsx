export default function TradingChartCard() {
  const chartData = {
    open: '0.014974',
    high: '0.015009',
    low: '0.014992',
    close: '0.014931',
    change: '-0.000042',
    changePercent: '-0.28%',
    currentPrice: '0.015567'
  };

  // Generate sample candlestick data
  const generateCandlestickData = () => {
    const data = [];
    const basePrice = 0.015;
    let currentPrice = basePrice;

    for (let i = 0; i < 50; i++) {
      const change = (Math.random() - 0.5) * 0.0002;
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) + Math.random() * 0.0001;
      const low = Math.min(open, close) - Math.random() * 0.0001;

      data.push({ open, high, low, close });
      currentPrice = close;
    }
    return data;
  };

  const candlesticks = generateCandlestickData();

  return (
    <div className='bg-gray-900 rounded-lg p-6'>
      {/* Chart Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-4 text-sm'>
          <span className='text-blue-400'>O</span>
          <span className='text-white'>{chartData.open}</span>
          <span className='text-green-400'>H</span>
          <span className='text-white'>{chartData.high}</span>
          <span className='text-red-400'>L</span>
          <span className='text-white'>{chartData.low}</span>
          <span className='text-blue-400'>C</span>
          <span className='text-white'>{chartData.close}</span>
          <span className='text-red-400'>{chartData.change}</span>
          <span className='text-red-400'>({chartData.changePercent})</span>
        </div>
        <div className='text-right'>
          <div className='text-xs text-gray-400'>High</div>
          <div className='text-white text-sm'>{chartData.currentPrice}</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className='relative h-80 bg-gray-800 rounded'>
        {/* Price Scale */}
        <div className='absolute right-2 top-0 h-full flex flex-col justify-between py-4 text-xs text-gray-400'>
          <span>0.0154</span>
          <span>0.0152</span>
          <span>0.015</span>
          <span className='text-blue-400'>0.014931</span>
          <span>0.0148</span>
          <span>0.0146</span>
          <span>Low 0.01446</span>
          <span className='text-xs'>0.0144</span>
        </div>

        {/* Candlestick Chart */}
        <div className='flex items-end h-full px-4 py-4 gap-1'>
          {candlesticks.map((candle, index) => {
            const isGreen = candle.close > candle.open;
            const bodyHeight = Math.abs(candle.close - candle.open) * 2000;
            const wickTop = (candle.high - Math.max(candle.open, candle.close)) * 2000;
            const wickBottom = (Math.min(candle.open, candle.close) - candle.low) * 2000;

            return (
              <div key={index} className='flex flex-col items-center' style={{ width: '3px' }}>
                {/* Upper wick */}
                <div
                  className={`w-px ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ height: `${wickTop}px` }}
                />
                {/* Body */}
                <div
                  className={`w-full ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ height: `${Math.max(bodyHeight, 1)}px` }}
                />
                {/* Lower wick */}
                <div
                  className={`w-px ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ height: `${wickBottom}px` }}
                />
              </div>
            );
          })}
        </div>

        {/* TradingView Logo */}
        <div className='absolute bottom-2 left-2'>
          <div className='bg-gray-700 px-2 py-1 rounded text-xs text-gray-400'>TV</div>
        </div>
      </div>

      {/* Time Scale */}
      <div className='flex justify-between mt-2 text-xs text-gray-400 px-4'>
        <span>09:00</span>
        <span>10:30</span>
        <span>12:00</span>
        <span>13:30</span>
        <span>15:00</span>
        <span>16:30</span>
        <span>18:00</span>
        <span>19:</span>
      </div>
    </div>
  );
}
