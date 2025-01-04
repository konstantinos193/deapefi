export interface Ethereum {
  request: (args: { method: string; params?: Array<string | number | object> }) => Promise<Array<string> | string>
  on: (event: 'accountsChanged' | 'chainChanged', handler: (args: Array<string>) => void) => void
  removeListener: (event: 'accountsChanged' | 'chainChanged', handler: (args: Array<string>) => void) => void
  isMetaMask?: boolean
  selectedAddress?: string | null
  chainId?: string
  networkVersion?: string
  _metamask?: {
    isUnlocked: () => Promise<boolean>
  }
}

declare global {
  interface Window {
    ethereum?: Ethereum
    okxwallet?: Ethereum
  }
}

export interface WalletError {
  code: number
  message: string
  data?: {
    code?: number
    message?: string
  }
}