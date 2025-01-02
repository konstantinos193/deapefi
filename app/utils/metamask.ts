// Declare the global window object with the optional ethereum property
declare global {
  interface Window {
    ethereum?: any;  // Make sure it's always optional
  }
}

// Function to sign a message using MetaMask
export async function signMessage(message: string, address: string): Promise<string> {
  try {
    // Check if MetaMask is installed
    if (!window?.ethereum) {
      throw new Error('Please install MetaMask');
    }

    // Request accounts first from MetaMask
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Get the current accounts in MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    // Ensure the provided address is the active account in MetaMask
    if (!accounts.includes(address.toLowerCase())) {
      throw new Error('Please switch to the correct account in MetaMask');
    }

    // Sign the message with the provided address
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address]
    });

    return signature;
  } catch (error: any) {
    // Log and throw any error encountered during signing
    console.error('Signing error:', error);
    throw new Error(error.message || 'Failed to sign message');
  }
}
