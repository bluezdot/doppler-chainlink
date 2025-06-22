'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { BigNumber } from 'bignumber.js';

// todo: balance
// todo: handle connect wallet/trade
// todo: handle quickAmount

export interface TokenBalance {
  decimal: number;
  formatted: string;
  symbol: string;
  value: bigint;
}

interface Props {
  price: string;
  baseTokenBalance: TokenBalance;
  quoteTokenBalance: TokenBalance;
  className?: string;
  style?: React.CSSProperties;
}

export default function TradingInterfaceCard({
  className,
  style,
  baseTokenBalance,
  quoteTokenBalance,
  price
}: Props) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState([
    '0.1 WETH',
    '0.2 WETH',
    '0.5 WETH',
    '0.8 WETH',
    'Max'
  ]);

  const handleQuickAmount = (quickAmount: string) => {
    if (quickAmount === 'Max') {
      if (activeTab === 'buy') {
        setAmount(quoteTokenBalance.formatted);
      } else {
        setAmount(baseTokenBalance.formatted);
      }
    } else {
      setAmount(quickAmount.replace(' WETH', ''));
    }
  };

  const calculateSellAmount = (inputAmount: string, price: string): string => {
    if (!inputAmount || isNaN(Number(inputAmount))) return '0';

    const amount = new BigNumber(inputAmount);
    const rate = new BigNumber(1).div(price);
    const result = amount.multipliedBy(rate);

    return result.toFixed();
  };

  const calculateBuyAmount = (inputAmount: string, price: string): string => {
    if (!inputAmount || isNaN(Number(inputAmount))) return '0';

    const amount = new BigNumber(inputAmount);
    const rate = new BigNumber(price);
    const result = amount.multipliedBy(rate);

    return result.toFixed();
  };

  const handleConnectWallet = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  useEffect(() => {
    if (activeTab === 'buy') {
      const balance = Number(quoteTokenBalance.formatted);

      setBalance(`${balance.toFixed(6)} ${quoteTokenBalance.symbol}`);
      // setQuickAmounts([
      //   `${(balance * 0.1).toFixed(4)} ${quoteTokenBalance.symbol}`,
      //   `${(balance * 0.2).toFixed(4)} ${quoteTokenBalance.symbol}`,
      //   `${(balance * 0.5).toFixed(4)} ${quoteTokenBalance.symbol}`,
      //   `${(balance * 0.8).toFixed(4)} ${quoteTokenBalance.symbol}`,
      //   'Max'
      // ]);
    } else {
      const balance = Number(baseTokenBalance.formatted);
      setBalance(`${balance.toFixed(6)} ${baseTokenBalance.symbol}`);
      // setQuickAmounts([
      //   `${(balance * 0.1).toFixed(4)} ${quoteTokenBalance.symbol}`,
      //   `${(balance * 0.2).toFixed(4)} ${quoteTokenBalance.symbol}`,
      //   `${(balance * 0.5).toFixed(4)} ${quoteTokenBalance.symbol}`,
      //   `${(balance * 0.8).toFixed(4)} ${quoteTokenBalance.symbol}`,
      //   'Max'
      // ]);
    }
  }, [
    activeTab,
    baseTokenBalance.formatted,
    baseTokenBalance.symbol,
    quoteTokenBalance.formatted,
    quoteTokenBalance.symbol
  ]);

  return (
    <div
      className={`p-6 ${className ?? ''}`}
      style={{ backgroundColor: '#1A1A1A', borderRadius: '12px', ...style }}
    >
      {/* Buy/Sell Toggle */}
      <div className='relative mb-6 rounded-lg p-1' style={{ backgroundColor: '#242424' }}>
        <div
          className='absolute top-2 bottom-1 rounded-md transition-all duration-300 ease-in-out transform'
          style={{
            backgroundColor: activeTab === 'buy' ? '#47E17B' : '#EF4444',
            width: activeTab === 'buy' ? 'calc(50% - 4px)' : 'calc(50% - 8px)',
            height: '75%',
            left: activeTab === 'buy' ? '8px' : 'calc(50% + 0px)',
            transform: activeTab === 'buy' ? 'translateX(0)' : 'translateX(0)'
          }}
        />

        {/* Buttons */}
        <div className='relative flex'>
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-3 px-6 rounded-md font-ppfd tracking-widest text-2xl transition-all duration-300 relative z-10 transform hover:scale-105 active:scale-95 ${
              activeTab === 'buy' ? 'text-black' : 'text-white hover:text-gray-300'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-3 px-6 rounded-md font-ppfd tracking-widest text-2xl transition-all duration-300 relative z-10 transform hover:scale-105 active:scale-95 ${
              activeTab === 'sell' ? 'text-black' : 'text-white hover:text-gray-300'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Balance Display */}
      <div className='flex justify-end items-center mb-4'>
        <span className='text-gray-400 text-sm mr-2'>Bal. {balance}</span>
        <button className='text-gray-400 hover:text-white transition-colors'>
          <Settings className='w-4 h-4' />
        </button>
      </div>

      {/* Amount Input */}
      <div className='mb-4'>
        <div className='relative'>
          <input
            type='number'
            placeholder='Enter amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors'
            style={{ backgroundColor: '#242424' }}
          />
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2'>
            <span className='text-gray-300 text-lg pe-6'>
              {activeTab === 'buy' ? quoteTokenBalance.symbol : baseTokenBalance.symbol}
            </span>
            {/*<div>*/}
            {/*  <img src={'/images/EthereumLogo.png'} alt={'Token logo'} className='w-full h-full' />*/}
            {/*</div>*/}
          </div>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className='flex gap-2 mb-6'>
        {quickAmounts.map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={() => handleQuickAmount(quickAmount)}
            className='flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors border border-gray-700'
            style={{ backgroundColor: '#1A1A1A' }}
          >
            {quickAmount}
          </button>
        ))}
      </div>

      {/* You Receive Section */}
      <div className='mb-6'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-400 text-sm'>You receive</span>
          <span className='text-white font-medium'>
            {activeTab === 'buy'
              ? `${calculateBuyAmount(amount, price)} ${baseTokenBalance.symbol}`
              : `${calculateSellAmount(amount, price)} ${quoteTokenBalance.symbol}`}
          </span>
        </div>
      </div>

      {/* Connect Wallet Button */}
      <button
        onClick={handleConnectWallet}
        className='w-full bg-violet-500 hover:bg-violet-600 text-black font-ppfd tracking-wider text-xl py-4 rounded-lg transition-colors'
      >
        {isWalletConnected ? 'Trade' : 'Connect Wallet'}
      </button>
    </div>
  );
}
