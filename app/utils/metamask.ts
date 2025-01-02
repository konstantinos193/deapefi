// app/utils/metamask.ts

// Global declaration for 'ethereum' that is consistent across the project
declare global {
  interface Window {
    ethereum?: any;  // Optional property to avoid conflicts
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

    // Get current account
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts.includes(address.toLowerCase())) {
      throw new Error('Please switch to the correct account in MetaMask');
    }

    // Sign the message
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });

    return signature;
  } catch (error: any) {
    console.error('Signing error:', error);
    throw new Error(error.message || 'Failed to sign message');
  }
}
