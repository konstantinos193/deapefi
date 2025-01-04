export interface Wallet {
  address: string;
  nftBalance?: number;
  stakedNFTs?: string[];
  totalNFTs?: number;
  tier?: number;
  totalPoints?: number;
}

export interface Session {
  id: string;
  sessionId?: string;
  username: string;
  discordId: string;
  isDiscordConnected: boolean;
  wallets: Wallet[];
  createdAt: number;
  expiresAt?: number;
} 
