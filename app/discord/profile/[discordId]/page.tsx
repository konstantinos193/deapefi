import { WalletProvider } from '../../../providers/WalletProvider'
import DiscordProfile from '../../../components/DiscordProfile'

export default function DiscordProfilePage({
  params
}: {
  params: { discordId: string; sessionId: string } // Ensure sessionId is part of params
}) {
  // In a real implementation, you would verify the Discord authentication here
  const mockUsername = 'TestUser#1234' // This would come from Discord auth

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 py-12">
        <DiscordProfile
          discordId={params.discordId}
          username={mockUsername}
          sessionId={params.sessionId} // Pass sessionId to DiscordProfile
        />
      </div>
    </WalletProvider>
  )
}
