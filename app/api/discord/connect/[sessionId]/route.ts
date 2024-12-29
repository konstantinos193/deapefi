import { NextResponse } from 'next/server'

// In-memory sessions (replace with database in production)
const sessions = new Map()

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  console.log('GET session:', params.sessionId)

  try {
    // Get session from memory or create new
    let session = sessions.get(params.sessionId)
    
    if (!session) {
      // Initialize new session
      session = {
        id: params.sessionId,
        username: 'konstantinos193', // Get this from your Discord OAuth flow
        isDiscordConnected: true,    // This should be set when Discord auth completes
        wallets: [],
        createdAt: new Date().toISOString()
      }
      sessions.set(params.sessionId, session)
    }

    console.log('Returning session:', session)
    return NextResponse.json(session)

  } catch (error: any) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const body = await request.json()
    const { username } = body

    let session = sessions.get(params.sessionId)
    if (!session) {
      session = {
        id: params.sessionId,
        username,
        isDiscordConnected: true,
        wallets: [],
        createdAt: new Date().toISOString()
      }
    } else {
      session.username = username
      session.isDiscordConnected = true
    }

    sessions.set(params.sessionId, session)
    return NextResponse.json(session)

  } catch (error: any) {
    console.error('Session update error:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
} 