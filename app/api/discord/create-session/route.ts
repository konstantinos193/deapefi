import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sessionStore } from '../../../lib/sessionStore'

export async function POST(request: Request) {
  try {
    const { discordId, username } = await request.json()

    if (!discordId || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create a new session
    const sessionId = sessionStore.create({
      discordId,
      username,
      wallets: []
    })

    // Clean up expired sessions
    sessionStore.cleanup()

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
} 