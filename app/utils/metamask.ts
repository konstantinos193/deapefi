// Global declaration for 'ethereum' that is consistent across the project
declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

// Function to sign a message with MetaMask
export async function signMessage(message: string, address: string): Promise<string> {
  try {
    // Check if window.ethereum exists (ensures we're in a browser environment)
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask');
    }

    // Request accounts first
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get current account (cast to a string array)
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    }) as string[]; // Cast the result to an array of strings

    if (!accounts.includes(address.toLowerCase())) {
      throw new Error('Please switch to the correct account in MetaMask');
    }

    // Sign the message
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });

    return signature as string;
  } catch (error: any) {
    console.error('Signing error:', error);
    throw new Error(error.message || 'Failed to sign message');
  }
}
