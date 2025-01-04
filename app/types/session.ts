export interface Session {
  id: string;
  sessionId?: string;
  username: string;
  discordId: string;
  isDiscordConnected: boolean;
  wallets: any[];
  createdAt: number;
} 