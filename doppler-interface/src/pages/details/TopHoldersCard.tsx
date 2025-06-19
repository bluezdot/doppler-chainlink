import { Star } from 'lucide-react';

interface Holder {
  rank: number;
  address: string;
  percentage: string;
}

interface Props {
  topHolders: Holder[];
}

export default function TopHoldersCard() {
  // Sample holders data
  const holders: Holder[] = [
    { rank: 1, address: 'SqMdjt...5qMdjt', percentage: '88.57%' },
    { rank: 2, address: 'hqMdjt...ZqMdjt', percentage: '1.31%' },
    { rank: 3, address: '8qMdjt...6qMdjt', percentage: '1.23%' },
    { rank: 4, address: '8qMdjt...6qMdjt', percentage: '1.23%' },
    { rank: 5, address: '05Mdjt...6qMdjt', percentage: '0.64%' },
    { rank: 6, address: 'sfMdjt...6qMdjt', percentage: '0.52%' },
    { rank: 7, address: '43Mdjt...6qMdjt', percentage: '0.44%' },
    { rank: 8, address: 'g4Mdjt...6qMdjt', percentage: '0.21%' },
    { rank: 9, address: '6tMdjt...6qMdjt', percentage: '0.10%' },
    { rank: 10, address: 'gtMdjt...6qMdjt', percentage: '0.10%' }
  ];

  return (
    <div className='p-6' style={{ backgroundColor: '#1A1A1A', borderRadius: '12px' }}>
      {/* Title */}
      <h2 className='text-white text-2xl font-bold mb-6'>Top holders</h2>

      {/* Holders List */}
      <div className='space-y-4'>
        {holders.map((holder) => (
          <div key={holder.rank} className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {/* Star icon for top 3 holders */}
              {holder.rank <= 3 ? (
                <Star className='w-5 h-5 text-yellow-400 fill-current' />
              ) : (
                <span className='w-5 h-5 flex items-center justify-center text-gray-400 text-sm font-medium'>
                  {holder.rank}
                </span>
              )}
              <span className='text-gray-400 text-sm'>{holder.address}</span>
            </div>
            <span className='text-white font-medium'>{holder.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
