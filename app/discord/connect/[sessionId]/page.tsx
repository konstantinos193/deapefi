import DiscordProfile from '../../../components/DiscordProfile'
import { WalletProvider } from '../../../providers/WalletProvider'

export default function ConnectPage({
  params
}: {
  params: { sessionId: string }
}) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 py-12">
        <DiscordProfile sessionId={params.sessionId} />
      </div>
    </WalletProvider>
  )
} 