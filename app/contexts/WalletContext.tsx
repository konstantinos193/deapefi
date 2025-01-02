'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Ethereum } from '../types/global'
import { ethers } from 'ethers'

interface WalletContextType {
  isConnected: boolean
  address: string
  isConnecting: boolean
  error: string | null
  connectWallet: () => Promise<string>
  disconnectWallet: () => void
  signMessage: (message: string) => Promise<string>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const APECHAIN_CONFIG = {
  chainId: '0x8173',
  chainName: 'ApeChain',
  nativeCurrency: {
    name: 'APE',
    symbol: 'APE',
    decimals: 18
  },
  rpcUrls: ['https://apechain.calderachain.xyz/http'],
  blockExplorerUrls: ['https://apechain.calderaexplorer.xyz/']
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // Check for stored connection
      const storedConnected = localStorage.getItem('walletConnected')
      const storedAddress = localStorage.getItem('walletAddress')
      if (storedConnected && storedAddress) {
        setIsConnected(true)
        setAddress(storedAddress)
      }

      // Handle account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAddress(accounts[0])
          setIsConnected(true)
          localStorage.setItem('walletConnected', 'true')
          localStorage.setItem('walletAddress', accounts[0])
        }
      }

      // Handle chain changes
      const handleChainChanged = () => {
        window.location.reload()
      }

      const ethereum = window.ethereum as Ethereum
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('chainChanged', handleChainChanged)

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
        ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      if (!window.ethereum) {
        throw new Error('Please install MetaMask')
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];  // Type assertion here

      // Switch to ApeChain
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: APECHAIN_CONFIG.chainId }]
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [APECHAIN_CONFIG]
          })
        } else {
          throw switchError
        }
      }

      const address = accounts[0]
      setIsConnected(true)
      setAddress(address)
      localStorage.setItem('walletConnected', 'true')
      localStorage.setItem('walletAddress', address)
      return address

    } catch (error: any) {
      console.error('Wallet connection error:', error)
      setError(error.message)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress('')
    setError(null)
    localStorage.removeItem('walletConnected')
    localStorage.removeItem('walletAddress')
  }

  const signMessage = async (message: string) => {
    try {
      setError(null)
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask')
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const signature = await signer.signMessage(message)
      return signature

    } catch (error: any) {
      console.error('Signing error:', error)
      setError(error.message)
      throw error
    }
  }

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      isConnecting,
      error,
      connectWallet,
      disconnectWallet,
      signMessage
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
