import { NextResponse } from 'next/server'
import { sessionStore } from '../../../../lib/sessionStore'

export async function GET(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  console.log('GET session:', params.sessionId)

  const session = sessionStore.get(params.sessionId)
  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(session)
}

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { address, signature, message } = await request.json()
    const session = sessionStore.get(params.sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const updatedSession = {
      ...session,
      wallets: [...session.wallets, address]
    }

    sessionStore.update(params.sessionId, updatedSession)

    return NextResponse.json({
      success: true,
      session: updatedSession
    })
  } catch (error) {
    console.error('Wallet connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect wallet' },
      { status: 500 }
    )
  }
}
