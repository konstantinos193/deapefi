'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Wallet {
  address: string
  nftBalance?: number
  stakedNFTs?: string[]
}

interface Session {
  id: string
  username?: string
  isDiscordConnected: boolean
  wallets: Wallet[]
  createdAt: number
  expiresAt: number
}

interface SessionContextType {
  session: Session | null
  updateSession: (newSession: Session) => void
}

const defaultSession: Session = {
  id: 'default-session',
  username: 'Anonymous',
  isDiscordConnected: false,
  wallets: [],
  createdAt: Date.now(),
  expiresAt: Date.now() + (24 * 60 * 60 * 1000)
}

const SessionContext = createContext<SessionContextType>({
  session: defaultSession,
  updateSession: () => {}
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const [session, setSession] = useState<Session>(defaultSession)

  useEffect(() => {
    const sessionId = searchParams?.get('sessionId') || 'default-session'
    const username = searchParams?.get('username') || 'Anonymous'
    
    setSession({
      id: sessionId,
      username: username,
      isDiscordConnected: true,
      wallets: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    })
  }, [searchParams])

  const updateSession = (newSession: Session) => {
    setSession(newSession)
  }

  return (
    <SessionContext.Provider value={{ session, updateSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
} 