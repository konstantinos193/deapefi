'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Ethereum } from '../types/global'

interface WalletContextType {
  isConnected: boolean
  address: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // Handle account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false)
          setAddress('')
          localStorage.removeItem('walletConnected')
          localStorage.removeItem('walletAddress')
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
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await (window.ethereum as Ethereum).request({
          method: 'eth_requestAccounts'
        })
        setIsConnected(true)
        setAddress(accounts[0])
        localStorage.setItem('walletConnected', 'true')
        localStorage.setItem('walletAddress', accounts[0])
      } catch (error) {
        console.error('Error connecting wallet:', error)
        throw error
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress('')
    localStorage.removeItem('walletConnected')
    localStorage.removeItem('walletAddress')
  }

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      connectWallet,
      disconnectWallet
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
