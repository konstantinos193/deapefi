'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
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

// Add API base URL
const API_BASE_URL = 'https://apeelitclubbotapi.onrender.com';

export function SessionProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const [session, setSession] = useState<Session>(defaultSession)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize session only once when component mounts or when URL params change
  useEffect(() => {
    if (isInitialized) return;

    const sessionId = searchParams?.get('sessionId')
    const username = searchParams?.get('username')
    const discordId = searchParams?.get('discordId')

    // Only initialize if we have the required params
    if (sessionId && username && discordId) {
      setSession({
        id: sessionId,
        username: decodeURIComponent(username),
        discordId: discordId,
        isDiscordConnected: true,
        wallets: [],
        createdAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      })
      setIsInitialized(true)
    }
  }, [searchParams, isInitialized])

  // Poll for session updates if we have an active session
  useEffect(() => {
    if (!session.id || session.id === 'default-session') return;

    let timeoutId: NodeJS.Timeout | undefined;
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 5;
    const baseDelay = 5000;

    const pollSession = async () => {
      try {
        // Use correct API URL
        const response = await fetch(`${API_BASE_URL}/api/session/${session.id}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_FRONTEND_API_KEY || '', // Make sure this env var is set
            'Content-Type': 'application/json'
          }
        });
        
        if (!mounted) return;

        if (response.status === 429) {
          const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
          retryCount++;
          
          if (retryCount < maxRetries) {
            timeoutId = setTimeout(pollSession, delay);
          }
          return;
        }

        const data = await response.json();
        retryCount = 0;

        if (data.status === 'complete') {
          return;
        }

        if (data.session) {
          setSession(data.session);
        }

        timeoutId = setTimeout(pollSession, baseDelay);

      } catch (error) {
        console.error('Session polling error:', error);
        const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
        retryCount++;
        
        if (retryCount < maxRetries) {
          timeoutId = setTimeout(pollSession, delay);
        }
      }
    };

    pollSession();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [session.id]);

  const updateSession = useCallback((newSession: Session) => {
    setSession(newSession)
  }, [])

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
