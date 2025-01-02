import { NextResponse } from 'next/server';
import { sessionStore, Session } from '../../../../lib/sessionStore';
import { ethers } from 'ethers';

export async function GET(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  console.log('GET session:', params.sessionId);

  // Retrieve the session from the sessionStore using the sessionId
  const session = sessionStore.get(params.sessionId);
  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }

  // Return the session if found
  return NextResponse.json(session);
}

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Parse the incoming JSON payload to extract the wallet address
    const { address } = await request.json();

    // Retrieve the session from the sessionStore using the sessionId
    const session = sessionStore.get(params.sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Validate the wallet address
    if (!ethers.utils.isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Add the wallet address to the session if it doesn't already exist
    if (!session.wallets.includes(address)) {
      const updatedSession: Session = {
        ...session,
        wallets: [...session.wallets, address],
      };

      // Update the session in the sessionStore
      sessionStore.update(params.sessionId, updatedSession);

      // Return the updated session
      return NextResponse.json({
        success: true,
        session: updatedSession,
      });
    }

    // If the wallet address already exists, return the existing session
    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect wallet' },
      { status: 500 }
    );
  }
}
