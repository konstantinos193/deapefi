'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useSession } from '../contexts/SessionContext'

// Accessing the environment variable directly
const API_KEY = process.env.NEXT_PUBLIC_FRONTEND_API_KEY;

interface DiscordProfileProps {
  sessionId: string; // Expecting sessionId as a prop
  username: string;  // Expecting username as a prop
  discordId: string; // Expecting discordId as a prop
}

export default function DiscordProfile({ sessionId, username, discordId }: DiscordProfileProps) {
  const { connectWallet, signMessage } = useWallet()
  const { session, updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Log props received
    console.log('Props received:', { sessionId, username, discordId });

    if (!sessionId || !username || !discordId) {
        console.error('Missing required props:', { sessionId, username, discordId });
        setError('Missing required fields');
        return;
    }

    const initSession = async () => {
        try {
            // Decode the username first
            const decodedUsername = decodeURIComponent(username);
            
            console.log('Initializing session with:', {
                sessionId,
                username: decodedUsername,
                discordId
            });

            // Fix the API URL - make sure this matches your actual API endpoint
            const response = await fetch(`https://discordadadadadadadadad.vercel.app/api/discord/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY || ''
                },
                body: JSON.stringify({
                    sessionId,
                    username: decodedUsername,
                    discordId,
                }),
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initialize session');
            }

            // Update session with server response
            updateSession(data.session);

        } catch (error) {
            console.error('Failed to initialize session:', error);
            setError('Failed to initialize verification. Please try again.');
        }
    };

    initSession();
  }, [sessionId, username, discordId]);

  const handleConnectWallet = async () => {
    if (!API_KEY) {
        setError('API Key is missing');
        return;
    }

    try {
        setIsLoading(true);
        setError('');
        setProgress(0);

        setStatus('Connecting wallet...');
        const address = await connectWallet();
        setProgress(30);

        setStatus('Signing verification message...');
        const timestamp = Date.now();
        const message = `Verify wallet ownership\nWallet: ${address}\nTimestamp: ${timestamp}`;
        const signature = await signMessage(message);
        setProgress(50);

        // Use sessionId from props
        const response = await fetch(`https://discordadadadadadadadad.vercel.app/api/discord/${sessionId}/wallets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                address,
                signature,
                message,
                timestamp,
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to verify wallet ownership');
        }

        // Update session with new wallet data
        updateSession(data.session);
        setProgress(100);
        setStatus('Wallet connected successfully!');

    } catch (error) {
        console.error('Wallet connection error:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Wallet Verification</h1>
        <p className="text-muted-foreground">Connect your wallets to verify NFT ownership</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Step 1: Connect Discord</h2>
          {session?.isDiscordConnected ? (
            <div className="flex items-center text-green-500">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Connected as {session.username || decodeURIComponent(username)}
            </div>
          ) : (
            <div className="text-yellow-500 flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Connecting to Discord...
            </div>
          )}
        </div>

        <div className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Step 2: Connect Wallets</h2>

          {session?.wallets?.map((wallet) => (
            <div key={wallet.address} className="mb-4 p-4 bg-secondary rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-mono text-sm">{wallet.address}</div>
                <div className="text-green-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Connected
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                NFTs: {wallet.nftBalance || 0} • Staked: {wallet.stakedNFTs?.length || 0} • Total: {wallet.totalNFTs || 0}
              </div>
            </div>
          ))}

          {isLoading ? (
            <div className="space-y-3">
              <div className="text-sm text-blue-400">{status}</div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              disabled={isLoading}
            >
              Add Another Wallet
            </button>
          )}

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        After connecting your wallets, your Discord roles will be automatically updated.
        <br />
        You can close this window once you've finished adding your wallets.
      </p>
    </div>
  )
}
