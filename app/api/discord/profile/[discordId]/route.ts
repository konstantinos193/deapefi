import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// You can keep this interface to ensure that the profile data follows a specific structure
interface DiscordProfile {
  discordId: string;
  username: string;
  wallets: string[];
}

// Mock function to simulate fetching a profile from the database
async function getProfileFromDatabase(discordId: string): Promise<DiscordProfile> {
  // Simulate fetching profile data from a database (replace with actual logic)
  return {
    discordId,
    username: 'SampleUser',
    wallets: ['wallet1', 'wallet2'],
  };
}

// Mock function to simulate updating a profile in the database
async function updateProfileInDatabase(updatedData: DiscordProfile): Promise<DiscordProfile> {
  // No need for discordId here if it's not being used
  return updatedData; // Simulate updating the profile in a database (replace with actual logic)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { discordId: string } } // Keep the correct parameter signature for route
) {
  try {
    // Fetch profile from the database
    const profile: DiscordProfile = await getProfileFromDatabase(params.discordId);
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
    // Update profile in the database
    const updatedProfile = await updateProfileInDatabase(body); // No discordId needed now
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
