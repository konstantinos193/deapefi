<<<<<<< HEAD
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sessionStore } from '../../../lib/sessionStore'
=======
import { NextResponse } from 'next/server';
import { sessionStore } from '../../../lib/sessionStore';
>>>>>>> e9a442863b6cc4e54baf62a32992811a6f76e89e

export async function POST(request: Request) {
  try {
    const { discordId, username } = await request.json();

    if (!discordId || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new session
    const sessionId = sessionStore.create({
      discordId,
      username,
      wallets: []
<<<<<<< HEAD
    })

    // Clean up expired sessions
    sessionStore.cleanup()
=======
    });

    // Clean up expired sessions
    sessionStore.cleanup();
>>>>>>> e9a442863b6cc4e54baf62a32992811a6f76e89e

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
