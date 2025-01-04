'use client'
import { useSession } from '../../contexts/SessionContext'
import DiscordProfile from '../../components/DiscordProfile'

export default function DiscordConnectPage() {
  const { session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DiscordProfile 
        discordId={session.discordId}
        sessionId={session.id}
        username={session.username}
      />
    </div>
  );
}
