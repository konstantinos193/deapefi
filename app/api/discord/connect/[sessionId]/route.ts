import { NextResponse } from 'next/server';
import { sessionStore, Session } from '../../../../lib/sessionStore';
import { ethers } from 'ethers';

// Handle the GET request to retrieve a session based on sessionId
export async function GET(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  console.log('GET session:', params.sessionId);

  // Retrieve the session from sessionStore using the sessionId
  const session = sessionStore.get(params.sessionId);

  // If session is not found, return 404 error
  if (!session) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }

  // If session is found, return the session
  return NextResponse.json(session);
}

// Handle the POST request to add a wallet address to a session
export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Parse the incoming JSON payload to extract the wallet address
    const { address } = await request.json();

    // Retrieve the session from sessionStore using sessionId
    const session = sessionStore.get(params.sessionId);

    // If session is not found, return 404 error
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

      // Update the session in sessionStore with the new wallet address
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
    // Log the error and return a generic error message
    console.error('Wallet connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect wallet' },
      { status: 500 }
    );
  }
}
