interface Props {
    //   progress: number; // in %
    //   availableToken: bigint;
    //   currentToken: bigint;
    //   totalSaleToken: bigint;
    onSwitchPhase: () => void;
}

export default function BondingCurveCard(props: Props) {
  const progressPercentage = 25;

  return (
    <div className='p-6' style={{ backgroundColor: '#1A1A1A', borderRadius: '12px' }}>
      {/* Title */}
      <h2 className='text-white text-3xl font-ppfd tracking-wider mb-6' onClick={props.onSwitchPhase}>Bonding Curve Progress</h2>

      {/* Progress Bar */}
      <div className='mb-6'>
        <div className='w-full bg-gray-600 rounded-full h-3'>
          <div
            className='bg-violet-500 h-3 rounded-full transition-all duration-300 ease-in-out'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Description Text */}
      <p className='text-gray-400 tracking-tighter text-base leading-relaxed'>
        There are 7,743,576,671.05 Crocs still available for sale in the bonding curve, with there
        are 13.15858 SUI currently in the curve. Once 2,000 SUI is raised during the fair-launch,
        all liquidity from the bonding curve will be deposited into the DEX and burned. Unsold
        tokens will also be burned. Progression continues as the price goes up.
      </p>
    </div>
  );
}
