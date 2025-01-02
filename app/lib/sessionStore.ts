<<<<<<< HEAD
import crypto from 'crypto'

// Define the Session interface
export interface Session {
  discordId: string
  username: string
  wallets: string[]
  createdAt: number
  expiresAt: number
}

// Create the sessions Map
const sessions = new Map<string, Session>()

// Export session management functions
export const sessionStore = {
  create: (sessionData: Omit<Session, 'createdAt' | 'expiresAt'>) => {
    const session: Session = {
      ...sessionData,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 // 1 hour
    }
    const sessionId = crypto.randomBytes(32).toString('hex')
    sessions.set(sessionId, session)
    return sessionId
  },

  get: (sessionId: string): Session | undefined => {
    return sessions.get(sessionId)
  },

  update: (sessionId: string, data: Partial<Session>): boolean => {
    const session = sessions.get(sessionId)
    if (session) {
      sessions.set(sessionId, { ...session, ...data })
      return true
    }
    return false
  },

  delete: (sessionId: string): boolean => {
    return sessions.delete(sessionId)
  },

  cleanup: (): void => {
    const now = Date.now()
    for (const [id, session] of sessions.entries()) {
      if (now > session.expiresAt) {
        sessions.delete(id)
      }
    }
  }
} 
=======
import crypto from 'crypto'

// Define the Session interface
export interface Session {
  discordId: string
  username: string
  wallets: string[]
  createdAt: number
  expiresAt: number
}

// Create the sessions Map
const sessions = new Map<string, Session>()

// Export session management functions
export const sessionStore = {
  create: (sessionData: Omit<Session, 'createdAt' | 'expiresAt'>) => {
    const session: Session = {
      ...sessionData,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 // 1 hour
    }
    const sessionId = crypto.randomBytes(32).toString('hex')
    sessions.set(sessionId, session)
    return sessionId
  },

  get: (sessionId: string): Session | undefined => {
    return sessions.get(sessionId)
  },

  update: (sessionId: string, data: Partial<Session>): boolean => {
    const session = sessions.get(sessionId)
    if (session) {
      sessions.set(sessionId, { ...session, ...data })
      return true
    }
    return false
  },

  delete: (sessionId: string): boolean => {
    return sessions.delete(sessionId)
  },

  cleanup: (): void => {
    const now = Date.now()
    for (const [id, session] of sessions.entries()) {
      if (now > session.expiresAt) {
        sessions.delete(id)
      }
    }
  }
} 
>>>>>>> e9a442863b6cc4e54baf62a32992811a6f76e89e
