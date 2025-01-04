'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Session } from '../types/session'

interface SessionContextType {
  session: Session | null
  updateSession: (session: Session) => void
}

const defaultSession: Session = {
  id: 'default-session',
  username: 'Anonymous',
  discordId: '',
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
    const sessionId = searchParams?.get('sessionId')
    if (!sessionId) return // Don't update if no sessionId

    const username = searchParams?.get('username') || 'Anonymous'
    const discordId = searchParams?.get('discordId') || ''
    
    // Create new session with search params
    const newSession = {
      id: sessionId,
      username: username,
      discordId: discordId,
      isDiscordConnected: !!discordId, // Set to true if discordId exists
      wallets: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    }

    setSession(newSession)

    // Optional: Store in localStorage for persistence
    try {
      localStorage.setItem('session', JSON.stringify(newSession))
    } catch (e) {
      console.error('Failed to store session:', e)
    }
  }, [searchParams])

  const updateSession = (newSession: Session) => {
    setSession(newSession)
    try {
      localStorage.setItem('session', JSON.stringify(newSession))
    } catch (e) {
      console.error('Failed to store updated session:', e)
    }
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
