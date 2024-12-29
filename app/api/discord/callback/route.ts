import { NextResponse } from 'next/server'
import { sessions } from '../create-session/route'

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/discord/callback'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This is our sessionId

    if (!code || !state) {
      throw new Error('Missing code or state')
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    // Update session
    const session = sessions.get(state)
    if (!session) {
      throw new Error('Invalid session')
    }

    session.isDiscordConnected = true
    session.discordId = userData.id
    session.username = userData.username

    // Redirect back to verification page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/discord/connect/${state}`)

  } catch (error) {
    console.error('Discord callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error?message=Authentication failed`)
  }
} 