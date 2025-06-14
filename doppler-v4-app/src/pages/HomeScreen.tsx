export default function HomeScreen() {
    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white p-8">
            {/* Navbar is rendered globally; header removed */}
            <div className="text-center mb-10">
                <h1 className="text-6xl font-bold tracking-wider mb-2">Pumpfun.fun</h1>
                <p className="text-2xl text-gray-500">The Best Meme Fair Launch Platform on MOVE</p>
            </div>
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
                <span className="bg-[#1A1A1A] rounded px-3 py-2 text-sm">Multi Chain</span>
                <span className="bg-[#1A1A1A] rounded px-3 py-2 text-sm flex items-center gap-2">
          <input type="checkbox" className="form-checkbox rounded-sm" />
          <span>Verified Only</span>
        </span>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-[#1A1A1A] rounded-lg p-5 flex flex-col gap-4">
                        <div>
                            <h3 className="text-xl font-bold tracking-wide">This is fine</h3>
                            <p className="text-sm text-gray-400">Some description</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-28 h-28 bg-gray-700 rounded" />
                            <div className="flex flex-col flex-1 gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Market Cap</span>
                                    <span>$1,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Liquidity</span>
                                    <span>$500</span>
                                </div>
                                <div className="mt-auto">
                                    <div className="h-1 bg-gray-700 rounded-full">
                                        <div className="h-1 bg-[#7F4DFA] rounded-full w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
