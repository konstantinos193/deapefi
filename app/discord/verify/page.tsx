'use client'

import { Providers } from '../../components/Providers'
import dynamic from 'next/dynamic'

// Create a client-only version of DiscordProfile
const DynamicDiscordProfile = dynamic(
  () => import('../../components/DiscordProfile'),
  { ssr: false }
)

export default function VerifyPage() {
  // Mock values for props (You can get them from context, API, or props)
  const sessionId = 'mockSessionId' // Replace with real session ID logic
  const discordId = 'mockDiscordId' // Replace with real Discord ID logic
  const username = 'TestUser#1234' // Replace with real username logic

  return (
    <Providers>
      <DynamicDiscordProfile
        sessionId={sessionId}  // Pass sessionId
        discordId={discordId}  // Pass discordId
        username={username}    // Pass username
      />
    </Providers>
  )
}
