import { NextResponse } from 'next/server';
import { sessionStore } from '../../../lib/sessionStore';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // Removed state validation for now
    if (!code || !state) {
      return NextResponse.redirect(`${APP_URL}/error?message=Invalid OAuth callback`);
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
        redirect_uri: REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(`${APP_URL}/error?message=Authentication failed`);
    }

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('User info fetch failed:', userData);
      return NextResponse.redirect(`${APP_URL}/error?message=Failed to get user info`);
    }

    // Create a new session
    const sessionId = sessionStore.create({
      discordId: userData.id,
      username: userData.username,
      wallets: [],
    });

    // Redirect to the profile page with session info
    const redirectUrl = `${APP_URL}/discord/profile/${userData.id}?sessionId=${sessionId}&username=${userData.username}&discordId=${userData.id}`;
    return NextResponse.redirect(redirectUrl);
    
  } catch (error) {
    console.error('Discord callback error:', error);
    return NextResponse.redirect(`${APP_URL}/error?message=Authentication failed`);
  }
}
