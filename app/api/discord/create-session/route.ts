import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Move sessions to a separate store file
import { sessions } from '../../../lib/sessionStore'

interface Session {
  discordId: string
  username: string
  wallets: string[]
  createdAt: number
  expiresAt: number
}

export async function POST(request: Request) {
  try {
    const { discordId, username } = await request.json()

    if (!discordId || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a random session ID
    const sessionId = crypto.randomBytes(32).toString('hex')

    // Create a new session that expires in 1 hour
    const session: Session = {
      discordId,
      username,
      wallets: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 // 1 hour from now
    }

    // Store the session
    sessions.set(sessionId, session)

    // Clean up expired sessions
    for (const [id, sess] of sessions.entries()) {
      if (Date.now() > sess.expiresAt) {
        sessions.delete(id)
      }
    }

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
} 
