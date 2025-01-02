import DiscordProfile from '../../../components/DiscordProfile'
import { WalletProvider } from '../../../providers/WalletProvider'

export default function ConnectPage({
  params
}: {
  params: { sessionId: string; username: string; discordId: string } // Include username and discordId here
}) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 py-12">
        {/* Pass the username and discordId along with sessionId */}
        <DiscordProfile sessionId={params.sessionId} username={params.username} discordId={params.discordId} />
      </div>
    </WalletProvider>
  )
}
