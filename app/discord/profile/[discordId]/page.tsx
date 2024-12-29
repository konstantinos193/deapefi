import DiscordProfile from '@/app/components/DiscordProfile'
import { WalletProvider } from '@/app/providers/WalletProvider'

export default function DiscordProfilePage({
  params
}: {
  params: { discordId: string }
}) {
  // In a real implementation, you would verify the Discord authentication here
  const mockUsername = 'TestUser#1234' // This would come from Discord auth

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 py-12">
        <DiscordProfile
          discordId={params.discordId}
          username={mockUsername}
        />
      </div>
    </WalletProvider>
  )
} 