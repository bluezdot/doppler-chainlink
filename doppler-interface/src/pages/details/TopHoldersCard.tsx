import { Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTopHolders } from '@/gql';
import { Address } from 'viem';
import { useParams } from 'react-router-dom';
import { getProgressPercent, shortenAddress } from '@/utils/utils';

interface Holder {
  rank: number;
  address: string;
  percentage: string;
}

interface Props {
  currentTotalSales: string;
}

export default function TopHoldersCard(props: Props) {
  console.log(props.currentTotalSales);

  const { id } = useParams();

  const {
    data: topHolders,
    error,
    isLoading
  } = useQuery({
    queryKey: ['topHolders', id, 84532],
    queryFn: async () => getTopHolders(id as Address, 84532)
  });

  const holders2 = [
    {
      balance: '570079875489847408751703037',
      user: {
        address: '0x1b3183564151e4ffe78a128c9ceb863e1ad4463b'
      }
    },
    {
      balance: '415908433468166400355926327',
      user: {
        address: '0xb60558c2695e3644eeb6d86a10505a5059334c38'
      }
    },
    {
      balance: '9000000000000000000000000',
      user: {
        address: '0x98612fdfc6237a19ce73e0151edeff6d2c18a7e1'
      }
    },
    {
      balance: '5011691041986190892370636',
      user: {
        address: '0x95a3b728b4ce482bc894cfa34d798ba570180c00'
      }
    },
    {
      balance: '0',
      user: {
        address: '0x7e6cf695a8bea4b2bf94fbb5434a7da3f39a2f8d'
      }
    },
    {
      balance: '-1000000000000000000000000000',
      user: {
        address: '0x0000000000000000000000000000000000000000'
      }
    }
  ];

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
    !isLoading &&
    !error && (
      <div className='p-6' style={{ backgroundColor: '#1A1A1A', borderRadius: '12px' }}>
        {/* Title */}
        <h2 className='text-white text-2xl font-bold mb-6'>Top holders</h2>

        {/* Holders List */}
        <div className='space-y-4'>
          {holders2.map((holder, rank) => (
            <div key={rank} className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                {/* Star icon for top 3 holders */}
                {rank <= 2 ? (
                  <Star className='w-5 h-5 text-yellow-400 fill-current' />
                ) : (
                  <span className='w-5 h-5 flex items-center justify-center text-gray-400 text-sm font-medium'>
                    {rank}
                  </span>
                )}
                <span className='text-gray-400 text-sm'>{shortenAddress(holder.user.address)}</span>
              </div>
              <span className='text-white font-medium'>
                {getProgressPercent(holder.balance, props.currentTotalSales)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
