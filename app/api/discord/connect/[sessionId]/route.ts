import { NextResponse } from 'next/server'
import { sessionStore, Session } from '../../../../lib/sessionStore'
import { ethers } from 'ethers'

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
    const { address } = await request.json()
    const session = sessionStore.get(params.sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (!ethers.utils.isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }

    // Add wallet to session if it doesn't exist
    if (!session.wallets.includes(address)) {
      const updatedSession: Session = {
        ...session,
        wallets: [...session.wallets, address]
      }

      sessionStore.update(params.sessionId, updatedSession)

      return NextResponse.json({
        success: true,
        session: updatedSession
      })
    }

    return NextResponse.json({
      success: true,
      session
    })

  } catch (error) {
    console.error('Wallet connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect wallet' },
      { status: 500 }
    )
  }
}