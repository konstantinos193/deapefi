import { NextResponse } from 'next/server';
import { sessionStore, Session } from '../../../../lib/sessionStore';
import { ethers } from 'ethers';

// GET request handler for retrieving a session by sessionId
export async function GET(request: Request) {
  try {
    // Extract sessionId from the URL parameters (without destructuring in function parameters)
    const url = new URL(request.url);
    const sessionId = url.pathname.split('/')[4]; // Extract the sessionId from the URL

    console.log('GET session:', sessionId);

    // Retrieve the session from sessionStore using sessionId
    const session = sessionStore.get(sessionId);

    if (!session) {
      // Return 404 error if session is not found
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Return the session if found
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}

// POST request handler for adding a wallet address to a session
export async function POST(request: Request) {
  try {
    const { address } = await request.json(); // Extract address from the request body

    // Extract sessionId from the URL parameters (without destructuring in function parameters)
    const url = new URL(request.url);
    const sessionId = url.pathname.split('/')[4]; // Extract the sessionId from the URL

    // Retrieve the session from sessionStore using sessionId
    const session = sessionStore.get(sessionId);

    if (!session) {
      // Return 404 error if session is not found
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Validate the wallet address format
    if (!ethers.utils.isAddress(address)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    // Check if the wallet address already exists in the session
    if (!session.wallets.includes(address)) {
      // Add the wallet address to the session if not already included
      const updatedSession: Session = {
        ...session,
        wallets: [...session.wallets, address],
      };

      // Update the session in sessionStore with the new wallet address
      sessionStore.update(sessionId, updatedSession);

      // Return the updated session
      return NextResponse.json({ success: true, session: updatedSession });
    }

    // If the wallet address already exists, return the existing session
    return NextResponse.json({ success: true, session });
  } catch (error) {
    // Log and return a server error response
    console.error('Wallet connection error:', error);
    return NextResponse.json({ error: 'Failed to connect wallet' }, { status: 500 });
  }
}
