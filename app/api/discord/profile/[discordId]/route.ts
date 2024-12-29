import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface DiscordProfile {
  discordId: string;
  username: string;
  wallets: string[];
}

async function getProfileFromDatabase(discordId: string): Promise<DiscordProfile> {
  return {
    discordId,
    username: 'SampleUser',
    wallets: ['wallet1', 'wallet2'],
  };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const discordId = url.pathname.split('/').pop(); // Extract discordId from the URL
    if (!discordId) {
      throw new Error('Invalid discordId');
    }
    const profile: DiscordProfile = await getProfileFromDatabase(discordId);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { discordId: string } }
) {
  try {
    const body: DiscordProfile = await request.json();
    const updatedProfile = await updateProfileInDatabase(body);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
