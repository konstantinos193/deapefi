'use client'

import { WalletProvider } from '../../../providers/WalletProvider'
import DiscordProfile from '../../../components/DiscordProfile'
import { useSearchParams } from 'next/navigation'

export default function ConnectPage() {
  const searchParams = useSearchParams()
  
  // Get parameters from URL query string
  const sessionId = searchParams.get('sessionId')
  const username = searchParams.get('username')
  const discordId = searchParams.get('discordId')

  // Debug log
  console.log('URL Parameters:', { sessionId, username, discordId })

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-900 py-12">
        <DiscordProfile 
          sessionId={sessionId || ''} 
          username={username || ''} 
          discordId={discordId || ''} 
        />
      </div>
    </WalletProvider>
  )
}
