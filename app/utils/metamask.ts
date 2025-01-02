// Declare the global window object with the ethereum property, ensuring it's consistently optional
declare global {
  interface Window {
    ethereum?: any;  // Optional property to match across the codebase
  }
}

// Function to sign a message using MetaMask
export async function signMessage(message: string, address: string): Promise<string> {
  try {
    // Check if MetaMask is installed by checking for window.ethereum
    if (!window?.ethereum) {
      throw new Error('Please install MetaMask');
    }

    // Request accounts first from MetaMask
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get the current accounts in MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    // Ensure the provided address matches the account in MetaMask
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
