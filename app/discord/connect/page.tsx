import { Providers } from '../../components/Providers'
import DiscordProfile from '../../components/DiscordProfile'

export default function DiscordConnectPage({
  params
}: {
  params: { sessionId: string; username: string; discordId: string }
}) {
  return (
    <Providers>
      {/* Pass the sessionId, username, and discordId to DiscordProfile */}
      <DiscordProfile 
        sessionId={params.sessionId} 
        username={params.username} 
        discordId={params.discordId} 
      />
    </Providers>
  )
}
