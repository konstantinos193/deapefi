'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useSession } from '../contexts/SessionContext'
import { useSearchParams } from 'next/navigation'
import type { Session } from '../types/session'

const API_KEY = process.env.NEXT_PUBLIC_FRONTEND_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DiscordProfileProps {
  sessionId?: string;
  username?: string;
  discordId?: string;
}

const DiscordProfile: React.FC<DiscordProfileProps> = ({ sessionId: propSessionId, username: propUsername, discordId: propDiscordId }) => {
  const searchParams = useSearchParams()
  const { connectWallet, signMessage } = useWallet()
  const { session, updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)

  // Use props if provided, otherwise use search params
  const sessionId = propSessionId || searchParams.get('sessionId')
  const username = propUsername || searchParams.get('username')
  const discordId = propDiscordId || searchParams.get('discordId')

  useEffect(() => {
    if (!sessionId || !username || !discordId) {
      setError('Missing URL parameters. Please try reconnecting through Discord.')
      console.error('Missing required URL parameters:', { sessionId, username, discordId })
      return
    }
    console.log('DiscordProfile mounted with:', {
      props: { sessionId, username, discordId },
      currentSession: session
    });
  }, [sessionId, username, discordId, session]);

  useEffect(() => {
    if (session?.id && !session.sessionId) {
      const updatedSession: Session = {
        ...session,
        sessionId: session.id,
        username: username || session.username,
        discordId: discordId || session.discordId
      };
      updateSession(updatedSession);
    }
  }, [session, sessionId, username, discordId, updateSession]);

  useEffect(() => {
    const initSession = async () => {
      if (!sessionId || !username || !discordId) {
        console.error('Missing required props:', { sessionId, username, discordId });
        setError('Missing required fields');
        return;
      }

      try {
        console.log('Initializing session with:', { sessionId, username, discordId });

        // First try to get existing session
        const getSessionResponse = await fetch(`${API_URL}/api/session/${sessionId}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY || '',
          },
          credentials: 'include',
        });

        if (getSessionResponse.ok) {
          const existingSession = await getSessionResponse.json();
          console.log('Existing session data:', existingSession);
          updateSession(existingSession);
          return;
        }

        // If session doesn't exist, create a new one
        const createSessionResponse = await fetch(`${API_URL}/api/discord/webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY || ''
          },
          body: JSON.stringify({
            sessionId,
            username: decodeURIComponent(username),
            discordId
          })
        });

        if (!createSessionResponse.ok) {
          throw new Error('Failed to create session');
        }

        const data = await createSessionResponse.json();
        console.log('New session data:', data);
        updateSession(data.session);

      } catch (error) {
        console.error('Session initialization failed:', error);
        setError('Failed to initialize session. Please try again.');
      }
    };

    initSession();
  }, [sessionId, username, discordId, updateSession]);

  useEffect(() => {
    console.log('Current session state:', {
      sessionId,
      session,
      API_URL,
      API_KEY: API_KEY ? 'present' : 'missing'
    });
  }, [sessionId, session]);

  useEffect(() => {
    console.log('Updated session state:', session);
  }, [session]);

  useEffect(() => {
    if (session?.wallets) {
      console.log('Wallets in session:', session.wallets);
    }
  }, [session]);

  const handleConnectWallet = async () => {
    if (!API_KEY) {
        console.error('API Key missing');
        setError('Configuration error: API Key missing');
        return;
    }

    if (!sessionId) {
        console.error('No sessionId available');
        setError('Session ID is missing. Please try reconnecting through Discord.');
        return;
    }

    try {
        setIsLoading(true);
        setError('');
        setProgress(0);

        // Log the request details
        console.log('Attempting wallet connection:', {
            sessionId,
            apiUrl: API_URL,
            hasApiKey: !!API_KEY
        });

        setStatus('Connecting wallet...');
        const address = await connectWallet();
        setProgress(30);

        setStatus('Signing verification message...');
        const timestamp = Date.now();
        const message = `Verify wallet ownership\nWallet: ${address}\nTimestamp: ${timestamp}`;
        const signature = await signMessage(message);
        setProgress(50);

        const endpoint = `${API_URL}/api/discord/${sessionId}/wallets`;
        console.log('Making request to:', endpoint);

        const response = await fetch(endpoint, {
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
            console.error('Wallet verification failed:', data);
            throw new Error(data.error || 'Failed to verify wallet ownership');
        }

        console.log('Wallet verification successful:', data);
        updateSession(data.session);
        setProgress(100);
        setStatus('Wallet connected successfully!');

    } catch (error: unknown) {
        console.error('Wallet connection error:', error);
        if (error instanceof Error) {
            setError(error.message);
        } else {
            setError('An unknown error occurred');
        }
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
              Connected as {session.username || (username ? decodeURIComponent(username) : 'Unknown User')}
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
                NFTs: {wallet.walletBalance || 0} • Staked: {wallet.stakedTokens || 0} • Total: {wallet.totalBalance || 0}
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

export default DiscordProfile;
