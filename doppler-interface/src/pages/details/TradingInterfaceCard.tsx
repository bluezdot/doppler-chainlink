'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';

// todo: balance
// todo: handle connect wallet

interface Props {
  balance: bigint;
  token: string;
}

export default function TradingInterfaceCard() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [balance] = useState('$1.475');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const quickAmounts = ['0.1 SOL', '0.2 SOL', '0.5 SOL', '1 SOL', 'Max'];

  const handleQuickAmount = (quickAmount: string) => {
    if (quickAmount === 'Max') {
      setAmount('1.475');
    } else {
      setAmount(quickAmount.replace(' SOL', ''));
    }
  };

  const calculateReceiveAmount = (inputAmount: string) => {
    if (!inputAmount || isNaN(Number(inputAmount))) return '0';
    // Simple calculation for demo - you can implement real conversion logic
    const solAmount = Number(inputAmount);
    const crocsAmount = solAmount * 1000000; // Example conversion rate
    return crocsAmount.toLocaleString();
  };

  const handleConnectWallet = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <div className='p-6' style={{ backgroundColor: '#1A1A1A', borderRadius: '12px' }}>
      {/* Buy/Sell Toggle */}
      <div className='relative mb-6 rounded-lg p-1' style={{ backgroundColor: '#242424' }}>
        <div
          className='absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-in-out transform'
          style={{
            backgroundColor: activeTab === 'buy' ? '#47E17B' : '#EF4444',
            width: 'calc(50% - 4px)',
            left: activeTab === 'buy' ? '4px' : 'calc(50% + 0px)',
            transform: activeTab === 'buy' ? 'translateX(0)' : 'translateX(0)'
          }}
        />

        {/* Buttons */}
        <div className='relative flex'>
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-300 relative z-10 transform hover:scale-105 active:scale-95 ${
              activeTab === 'buy' ? 'text-black' : 'text-white hover:text-gray-300'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-300 relative z-10 transform hover:scale-105 active:scale-95 ${
              activeTab === 'sell' ? 'text-black' : 'text-white hover:text-gray-300'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Balance Display */}
      <div className='flex justify-end items-center mb-4'>
        <span className='text-gray-400 text-sm mr-2'>Bal: {balance}</span>
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
            className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors'
            style={{ backgroundColor: '#242424' }}
          />
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2'>
            <span className='text-gray-300 font-medium'>SOL</span>
            <div>
              <img src={'/images/SolanaLogo.png'} alt={'Token logo'} className='w-full h-full' />
            </div>
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
          <span className='text-white font-medium'>{calculateReceiveAmount(amount)} Crocs</span>
        </div>
      </div>

      {/* Connect Wallet Button */}
      <button
        onClick={handleConnectWallet}
        className='w-full bg-violet-500 hover:bg-violet-600 text-black font-semibold py-4 rounded-lg transition-colors'
      >
        {isWalletConnected ? 'Trade' : 'Connect Wallet'}
      </button>
    </div>
  );
}
