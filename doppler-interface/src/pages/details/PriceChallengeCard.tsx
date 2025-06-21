'use client';

import { useState, useEffect } from 'react';

interface Props {
    onSwitchPhase: () => void;
}

export default function PriceChallengeCard(props: Props) {
  const [timeLeft, setTimeLeft] = useState({ minutes: 29, seconds: 12 });
  const [currentPrice] = useState('$0.0424232');
  const [initialPrice] = useState('$2,205.80');
  const [targetPrice] = useState('$2,205.80');

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  return (
    <div className='p-6' style={{ backgroundColor: '#1A1A1A', borderRadius: '12px' }}>
      {/* Header */}
      <div className='flex items-center justify-between'>
        {/* Title */}
        <h2 className='text-white text-3xl font-ppfd tracking-wider mb-6' onClick={props.onSwitchPhase}>Price challenge</h2>

        {/* Countdown Timer */}
        <div className='flex items-center gap-2'>
          <div className='flex items-center justify-center rounded-lg w-[41px] h-[46px] bg-[#47E17B]'>
            <span className='font-bold tracking-wider font-ppfd text-[28px] leading-none text-[#0F0F0F] translate-y-[3px]'>
              {formatTime(timeLeft.minutes)}
            </span>
          </div>

          <span className='font-bold tracking-wider text-[24px] leading-none text-[#47E17B]'>
            :
          </span>

          <div className='flex items-center justify-center rounded-lg w-[40px] h-[46px] bg-[#47E17B]'>
            <span className='font-bold tracking-wider font-ppfd text-[28px] leading-none text-[#0F0F0F] translate-y-[3px]'>
              {formatTime(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
        <div className='flex mt-8'>
            {/* Current Price Box */}
            <div
                className='relative flex flex-col items-center justify-center rounded-lg border overflow-hidden'
                style={{
                    width: '303px',
                    height: '173px',
                    backgroundColor: '#242424',
                    borderColor: '#8568E7',
                    borderWidth: '1px'
                }}
            >
                {/* Radial Gradient Overlay */}
                <div
                    className='absolute inset-0 pointer-events-none'
                    style={{
                        background: 'radial-gradient(50% 50% at 50% 50%, #9747FF 0%, rgba(0, 0, 0, 0) 100%)',
                        opacity: 0.84,
                        width: '295px',
                        height: '295px',
                        left: '4px',
                        top: '3px'
                    }}
                />

                {/* Content */}
                <div className='relative z-10 flex flex-col items-center gap-3'>
                    <div
                        className='text-center'
                        style={{
                            fontSize: '16px',
                            lineHeight: '20px',
                            color: '#999999'
                        }}
                    >
                        Current price
                    </div>
                    <div
                        className='text-center text-white tracking-wider font-ppfd'
                        style={{
                            fontSize: '42px',
                            lineHeight: '56px'
                        }}
                    >
                        {currentPrice}
                    </div>
                </div>
            </div>

            {/* Price Info */}
            <div className='flex flex-col justify-center gap-7 ml-auto items-end' style={{width: '171px'}}>
                {/* Initial Price */}
                <div className='flex flex-col gap-2'>
                    <div
                        className='text-right'
                        style={{
                            fontSize: '16px',
                            lineHeight: '20px',
                            color: '#6E6E6E'
                        }}
                    >
                        Initial
                    </div>
                    <div
                        className='text-white font-ppfd tracking-wider'
                        style={{
                            fontSize: '32px',
                            lineHeight: '43px'
                        }}
                    >
                        {initialPrice}
                    </div>
                </div>

                {/* Target Price */}
                <div className='flex flex-col gap-2'>
                    <div
                        className='text-right'
                        style={{
                            fontSize: '16px',
                            lineHeight: '20px',
                            color: '#6E6E6E'
                        }}
                    >
                        Target price
                    </div>
                    <div
                        className='text-white font-ppfd tracking-wider'
                        style={{
                            fontSize: '32px',
                            lineHeight: '43px'
                        }}
                    >
                        {targetPrice}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
