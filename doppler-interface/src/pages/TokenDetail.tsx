import React, { useState } from 'react';
import {
  Copy,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Share2,
  MoreHorizontal,
  Activity,
  Users,
  Lock,
  Globe,
  Twitter,
  MessageCircle
} from 'lucide-react';

const TokenDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1H');
  const [isWatchlisted, setIsWatchlisted] = useState<boolean>(false);

  const timeframes: string[] = ['1H', '4H', '1D', '7D', '1M'];

  const handleTabClick = (timeframe: string): void => {
    setActiveTab(timeframe);
  };

  const toggleWatchlist = (): void => {
    setIsWatchlisted((prev) => !prev);
  };

  return (
    <div className='min-h-screen bg-[#0F0F0F] text-white'>
      {/* Header */}
      <header className='flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A] bg-[#0F0F0F] sticky top-0 z-50'>
        <div className='flex items-center space-x-10'>
          <div className='flex items-center space-x-3'>
            <div className='text-2xl font-bold text-white'>LEVEL</div>
            <div className='w-2 h-2 bg-[#7F4DFA] rounded-full'></div>
          </div>
          <nav className='flex items-center space-x-8'>
            <button className='text-[#888888] hover:text-white transition-colors font-medium'>
              Portfolio
            </button>
            <button className='text-[#888888] hover:text-white transition-colors font-medium'>
              Discover
            </button>
            <button className='text-[#888888] hover:text-white transition-colors font-medium'>
              Trade
            </button>
          </nav>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center bg-[#1A1A1A] rounded-lg px-4 py-2'>
            <Search className='w-4 h-4 text-[#888888] mr-3' />
            <input
              type='text'
              placeholder='Search tokens...'
              className='bg-transparent text-white placeholder-[#888888] outline-none w-48'
            />
          </div>
          <button className='px-6 py-2.5 bg-[#22C55E] text-white rounded-lg font-semibold hover:bg-[#16A34A] transition-all duration-200 shadow-lg'>
            BUY
          </button>
          <button className='px-6 py-2.5 bg-[#EF4444] text-white rounded-lg font-semibold hover:bg-[#DC2626] transition-all duration-200 shadow-lg'>
            SELL
          </button>
        </div>
      </header>

      <div className='flex'>
        {/* Main Content */}
        <div className='flex-1 p-8 max-w-5xl'>
          {/* Token Header */}
          <div className='flex items-start justify-between mb-8'>
            <div className='flex items-start space-x-6'>
              {/* Token Image */}
              <div className='w-28 h-28 bg-[#1A1A1A] rounded-3xl p-3 border border-[#2B2A2F]'>
                <div className='w-full h-full bg-gradient-to-br from-[#7F4DFA] via-[#9333EA] to-[#C084FC] rounded-2xl flex items-center justify-center shadow-inner'>
                  <span className='text-3xl'>🐶</span>
                </div>
              </div>

              {/* Token Info */}
              <div className='flex-1'>
                <div className='flex items-center space-x-4 mb-3'>
                  <h1 className='text-6xl font-black leading-none text-white font-formula-condensed'>
                    This is fine
                  </h1>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={toggleWatchlist}
                      className={`p-2 rounded-lg transition-colors ${isWatchlisted ? 'bg-[#7F4DFA] text-white' : 'bg-[#1A1A1A] text-[#888888] hover:text-white'}`}
                    >
                      <Star className='w-5 h-5' />
                    </button>
                    <button className='p-2 bg-[#1A1A1A] text-[#888888] hover:text-white rounded-lg transition-colors'>
                      <Share2 className='w-5 h-5' />
                    </button>
                    <button className='p-2 bg-[#1A1A1A] text-[#888888] hover:text-white rounded-lg transition-colors'>
                      <MoreHorizontal className='w-5 h-5' />
                    </button>
                  </div>
                </div>

                <div className='flex items-center space-x-6 mb-4'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-3xl font-bold text-white'>$0.002463</span>
                    <div className='flex items-center space-x-1 bg-[#22C55E]/10 text-[#22C55E] px-2 py-1 rounded-lg'>
                      <TrendingUp className='w-4 h-4' />
                      <span className='font-semibold'>+2.34%</span>
                    </div>
                  </div>
                  <div className='text-[#888888] text-lg'>0.00000000321321 SOL</div>
                </div>

                {/* Social Links */}
                <div className='flex items-center space-x-3'>
                  <a
                    href='#'
                    className='flex items-center space-x-2 bg-[#1A1A1A] hover:bg-[#2B2A2F] px-3 py-2 rounded-lg transition-colors group'
                  >
                    <Globe className='w-4 h-4 text-[#888888] group-hover:text-white' />
                    <span className='text-sm text-[#888888] group-hover:text-white'>Website</span>
                  </a>
                  <a
                    href='#'
                    className='flex items-center space-x-2 bg-[#1A1A1A] hover:bg-[#2B2A2F] px-3 py-2 rounded-lg transition-colors group'
                  >
                    <Twitter className='w-4 h-4 text-[#888888] group-hover:text-white' />
                    <span className='text-sm text-[#888888] group-hover:text-white'>Twitter</span>
                  </a>
                  <a
                    href='#'
                    className='flex items-center space-x-2 bg-[#1A1A1A] hover:bg-[#2B2A2F] px-3 py-2 rounded-lg transition-colors group'
                  >
                    <MessageCircle className='w-4 h-4 text-[#888888] group-hover:text-white' />
                    <span className='text-sm text-[#888888] group-hover:text-white'>Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F] hover:border-[#7F4DFA]/20 transition-colors'>
              <div className='flex items-center justify-between mb-3'>
                <div className='text-[#888888] text-sm font-medium'>Market Cap</div>
                <Activity className='w-4 h-4 text-[#7F4DFA]' />
              </div>
              <div className='text-2xl font-bold text-white'>$892.1K</div>
              <div className='text-xs text-[#22C55E] mt-1'>+5.2% (24h)</div>
            </div>

            <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F] hover:border-[#7F4DFA]/20 transition-colors'>
              <div className='flex items-center justify-between mb-3'>
                <div className='text-[#888888] text-sm font-medium'>24h Volume</div>
                <TrendingUp className='w-4 h-4 text-[#22C55E]' />
              </div>
              <div className='text-2xl font-bold text-white'>$45.2K</div>
              <div className='text-xs text-[#EF4444] mt-1'>-2.1% (24h)</div>
            </div>

            <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F] hover:border-[#7F4DFA]/20 transition-colors'>
              <div className='flex items-center justify-between mb-3'>
                <div className='text-[#888888] text-sm font-medium'>Holders</div>
                <Users className='w-4 h-4 text-[#7F4DFA]' />
              </div>
              <div className='text-2xl font-bold text-white'>1,234</div>
              <div className='text-xs text-[#22C55E] mt-1'>+12 (24h)</div>
            </div>

            <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F] hover:border-[#7F4DFA]/20 transition-colors'>
              <div className='flex items-center justify-between mb-3'>
                <div className='text-[#888888] text-sm font-medium'>Liquidity</div>
                <Lock className='w-4 h-4 text-[#22C55E]' />
              </div>
              <div className='text-2xl font-bold text-[#22C55E]'>Locked</div>
              <div className='text-xs text-[#888888] mt-1'>$2.46M</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
            <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F]'>
              <div className='text-[#888888] text-sm font-medium mb-2'>Total Supply</div>
              <div className='text-xl font-bold text-white'>1,000,000,000</div>
              <div className='text-xs text-[#888888] mt-1'>Fixed Supply</div>
            </div>

            <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F]'>
              <div className='text-[#888888] text-sm font-medium mb-2'>Circulating Supply</div>
              <div className='text-xl font-bold text-white'>850,000,000</div>
              <div className='text-xs text-[#888888] mt-1'>85% of total</div>
            </div>

            <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F]'>
              <div className='text-[#888888] text-sm font-medium mb-2'>Contract Address</div>
              <div className='flex items-center space-x-2'>
                <div className='text-sm font-mono text-white truncate'>h32b3...1f2ga</div>
                <button className='text-[#7F4DFA] hover:text-[#9333EA] transition-colors'>
                  <Copy className='w-4 h-4' />
                </button>
              </div>
              <div className='text-xs text-[#888888] mt-1'>Verified Contract</div>
            </div>
          </div>

          {/* Description */}
          <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F]'>
            <h3 className='text-xl font-bold mb-4 text-white'>About This Token</h3>
            <p className='text-[#888888] leading-relaxed text-base'>
              This is fine is a community-driven meme token that embraces the iconic "This is Fine"
              meme. Built on Solana for fast and low-cost transactions, this token represents
              resilience and optimism in the face of market volatility. The project focuses on
              building a strong community while maintaining transparency and fair distribution.
            </p>
            <div className='flex items-center space-x-4 mt-4 pt-4 border-t border-[#2B2A2F]'>
              <div className='text-sm text-[#888888]'>
                <span className='font-medium'>Created:</span> December 2024
              </div>
              <div className='text-sm text-[#888888]'>
                <span className='font-medium'>Network:</span> Solana
              </div>
              <div className='text-sm text-[#888888]'>
                <span className='font-medium'>Type:</span> Meme Token
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='w-96 p-8 border-l border-[#1A1A1A] bg-[#0A0A0A]'>
          {/* Chart */}
          <div className='bg-[#1A1A1A] rounded-2xl p-6 mb-6 border border-[#2B2A2F]'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-bold text-white'>Price Chart</h3>
              <div className='flex space-x-1 bg-[#0F0F0F] rounded-lg p-1'>
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => handleTabClick(timeframe)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      activeTab === timeframe
                        ? 'bg-[#7F4DFA] text-white shadow-sm'
                        : 'text-[#888888] hover:text-white hover:bg-[#2B2A2F]'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            <div className='h-56 bg-[#0F0F0F] rounded-xl flex items-center justify-center border border-[#2B2A2F]'>
              <div className='text-center'>
                <TrendingUp className='w-12 h-12 text-[#7F4DFA] mx-auto mb-3' />
                <div className='text-[#888888] text-sm'>Chart Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-[#1A1A1A] rounded-2xl p-6 mb-6 border border-[#2B2A2F]'>
            <h3 className='text-lg font-bold mb-4 text-white'>Quick Actions</h3>
            <div className='space-y-3'>
              <button className='w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2'>
                <TrendingUp className='w-5 h-5' />
                <span>Buy Token</span>
              </button>
              <button className='w-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2'>
                <TrendingDown className='w-5 h-5' />
                <span>Sell Token</span>
              </button>
              <button className='w-full bg-[#2B2A2F] text-white py-3.5 rounded-xl font-semibold hover:bg-[#3B3A3F] transition-all duration-200 flex items-center justify-center space-x-2'>
                <Star className='w-5 h-5' />
                <span>Add to Watchlist</span>
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className='bg-[#1A1A1A] rounded-2xl p-6 border border-[#2B2A2F]'>
            <h3 className='text-lg font-bold mb-4 text-white'>Recent Transactions</h3>
            <div className='space-y-4'>
              {[
                {
                  type: 'BUY',
                  amount: '1.2K',
                  price: '$0.002463',
                  time: '2m ago',
                  color: '#22C55E',
                  user: 'a1b2c3...4d5e'
                },
                {
                  type: 'SELL',
                  amount: '892',
                  price: '$0.002461',
                  timeStamp: '5m ago',
                  user: 'f6q7h8...9g0j'
                },
                {
                  type: 'BUY',
                  amount: '2.1K',
                  price: '$0.002459',
                  timeStamp: '8m ago',
                  user: 'o1p2q3...4r5s'
                },
                {
                  type: 'SELL',
                  amount: '650',
                  price: '$0.002455',
                  timeStamp: '12m ago',
                  user: 't6u7v8...9w0x'
                },
                {
                  type: 'BUY',
                  amount: '3.2K',
                  price: '$0.002450',
                  timeStamp: '15m ago',
                  user: 'y1z2a3...4b5c'
                }
              ].map((tx, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between py-3 px-3 bg-[#0F0F0F] rounded-lg border border-[#2B2A2F]/50'
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className='w-3 h-3 rounded-full flex-shrink-0'
                      style={{ backgroundColor: tx.color }}
                    ></div>
                    <div>
                      <div className='font-semibold text-white text-sm'>
                        {tx.type} {tx.amount}
                      </div>
                      <div className='text-xs text-[#888888] font-mono'>{tx.user}</div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-semibold text-white text-sm'>{tx.price}</div>
                    <div className='text-xs text-[#888888]'>{tx.timeStamp}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className='w-full mt-4 py-2 text-[#7F4DFA] hover:text-[#9333EA] text-sm font-medium transition-colors'>
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
