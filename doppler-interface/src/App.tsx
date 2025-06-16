import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAccount, useConnect, useBalance, useSwitchChain, useDisconnect } from 'wagmi';
import DeployDoppler from './pages/DeployDoppler';
import ViewDoppler from './pages/ViewDoppler';
import HomeScreen from './pages/HomeScreen';
import { Button } from '@/components/ui/button';
import './theme.css';

function App() {
    const account = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();
    const { data: balance } = useBalance({
        address: account.addresses?.[0]
    });

    const handleConnect = () => {
        connect({ connector: connectors[0] });
    };

    const handleDisconnect = () => {
        disconnect();
    };

    const isBaseSepolia = account.chain?.id === 84532;

    const handleSwitchNetwork = () => {
        if (switchChain) {
            switchChain({ chainId: 84532 });
        }
    };

    return (
        <Router>
            <div className='min-h-screen bg-[#0F0F0F] text-white'>
                <header className='flex justify-between items-center p-6'>
                    <div className='flex items-center gap-2'>
                        <span className='w-4 h-4 rounded-full bg-[#7F4DFA]'></span>
                        <span className='text-lg font-bold tracking-wider'>LEVEL</span>
                    </div>
                    <div className='flex gap-3'>
                        {account.status === 'connected' ? (
                            <div className='flex items-center gap-4'>
                                <span className='text-sm'>
                                    {account.addresses?.[0]?.slice(0, 6)}...
                                    {account.addresses?.[0]?.slice(-4)}
                                </span>
                                <span className='text-sm text-gray-400'>
                                    {balance?.formatted.slice(0, 6)} ETH
                                </span>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={handleDisconnect}
                                    className='text-white hover:bg-gray-800'
                                >
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button 
                                    variant='outline' 
                                    className='bg-transparent border-gray-600 text-white hover:bg-gray-800'
                                    asChild
                                >
                                    <Link to='/deploy'>Create Token</Link>
                                </Button>
                                <Button 
                                    className='bg-[#7F4DFA] hover:bg-[#6B3FE8]'
                                    onClick={handleConnect}
                                >
                                    Connect Wallet
                                </Button>
                            </>
                        )}
                    </div>
                </header>

                {account.status === 'connected' && !isBaseSepolia && (
                    <div className='flex items-center justify-center min-h-[50vh]'>
                        <div className='bg-[#1A1A1A] p-6 rounded-lg flex flex-col items-center gap-4'>
                            <p className='text-lg'>Please switch to Base Sepolia network</p>
                            <Button onClick={handleSwitchNetwork} className='bg-[#7F4DFA] hover:bg-[#6B3FE8]'>
                                Switch Network
                            </Button>
                        </div>
                    </div>
                )}

                <main>
                    <Routes>
                        <Route path='/' element={<HomeScreen />} />
                        <Route path='/deploy' element={<DeployDoppler />} />
                        <Route path='/doppler/:id' element={<ViewDoppler />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
