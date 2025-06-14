import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export function Navbar() {
  const { isConnected, address } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const truncated = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return (
      <header className="container mx-auto flex items-center justify-between py-8">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#7F4DFA]"/>
          <span className="text-lg font-bold tracking-wider">LEVEL</span>
        </div>
        {isConnected && address ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{truncated}</span>
              <Button variant="outline" size="sm" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </div>
        ) : (
            <Button
                variant="outline"
                onClick={() => connect({connector: injected()})}
            >
              Connect Wallet
            </Button>
        )}
      </header>
  )
}
