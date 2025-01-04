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
    const sessionId = searchParams?.get('sessionId') || 'default-session'
    const username = searchParams?.get('username') || 'Anonymous'
    const discordId = searchParams?.get('discordId') || ''
    
    setSession({
      id: sessionId,
      username: username,
      discordId: discordId,
      isDiscordConnected: true,
      wallets: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    })
  }, [searchParams])

  const updateSession = (newSession: Session) => {
    setSession(newSession)
  }

  // Or if you plan to use it later, export it and mark it as intentionally unused
  export const useSessionPolling = (sessionId: string) => {
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 5;
    const baseDelay = 5000; // 5 seconds

    useEffect(() => {
      if (!sessionId) return;
      
      let timeoutId;
      let mounted = true;

      const pollSession = async () => {
        try {
          const response = await fetch(`/api/session/${sessionId}`);
          
          if (!mounted) return;

          if (response.status === 429) { // Rate limited
            // Exponential backoff
            const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
            setRetryCount(prev => prev + 1);
            
            if (retryCount < maxRetries) {
              timeoutId = setTimeout(pollSession, delay);
            }
            return;
          }

          const data = await response.json();
          
          // Reset retry count on successful request
          setRetryCount(0);

          // If session is complete, stop polling
          if (data.status === 'complete') {
            return;
          }

          // Continue polling with base delay
          timeoutId = setTimeout(pollSession, baseDelay);

        } catch (error) {
          console.error('Session polling error:', error);
          // Implement exponential backoff on errors
          const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
          setRetryCount(prev => prev + 1);
          
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
    }, [sessionId]);
  };

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
