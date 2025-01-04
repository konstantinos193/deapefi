'use client'

import { useWallet } from '../contexts/WalletContext'
import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { WalletError } from '../types/global'
import { Check } from 'lucide-react'

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

interface Wallet {
  id: string
  name: string
  icon: string
  isInstalled: boolean
}

const initialWallets: Wallet[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/metamask.png',
    isInstalled: false
  }
]

export default function WalletConnect() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [availableWallets, setAvailableWallets] = useState(initialWallets)

  const detectWallets = useCallback(() => {
    const updatedWallets = initialWallets.map(wallet => ({
      ...wallet,
      isInstalled: window?.ethereum ? true : false
    }))
    setAvailableWallets(updatedWallets)
  }, [])

  useEffect(() => {
    detectWallets()
  }, [detectWallets])

  const handleConnect = async (wallet: Wallet) => {
    setIsLoading(true)
    try {
      if (wallet.id === 'okx' && window.okxwallet) {
        await window.okxwallet.request({ method: 'eth_requestAccounts' })
        const chainId = await window.okxwallet.request({ method: 'eth_chainId' })
        if (chainId !== APECHAIN_CONFIG.chainId) {
          try {
            await window.okxwallet.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: APECHAIN_CONFIG.chainId }]
            })
          } catch (err: unknown) {
            const switchError = err as WalletError
            if (switchError.code === 4902) {
              await window.okxwallet.request({
                method: 'wallet_addEthereumChain',
                params: [APECHAIN_CONFIG]
              })
            }
          }
        }
      }
      await connectWallet()
      setIsOpen(false)
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''
  }

  return (
    <div className="relative group">
      <button
        onClick={() => !isConnected ? setIsOpen(true) : undefined}
        disabled={isLoading}
        className={`
          px-4 py-2 rounded-lg font-bold transition-all duration-200
          ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-opacity-90'}
          ${isConnected ? 'bg-green-600' : 'bg-[#0154fa] hover:bg-[#0143d1]'}

          text-white
        `}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </span>
        ) : isConnected ? (
          formatAddress(address)
        ) : (
          'Connect Wallet'
        )}
      </button>

      {isConnected && (
        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute right-0 top-full mt-1 w-48 py-2 bg-gray-800 rounded-lg shadow-xl z-50 transition-all duration-200">
          <button
            onClick={disconnectWallet}
            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-[#1a1f2e] p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-700 mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Connect Wallet</h3>
            <div className="grid gap-2">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet)}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-700/50 transition-colors w-full"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 relative mr-3">
                      <img 
                        src="https://play-lh.googleusercontent.com/8rzHJpfkdFwA0Lo6_CHUjoNt8OU3EyIe9BZNKGqj0C8BhleguW9LhXHbS46FAtLAJ9r2"
                        alt="MetaMask"
                        className="w-8 h-8"
                      />
                    </div>
                    <span className="text-white font-medium">{wallet.name}</span>
                  </div>
                  {wallet.isInstalled && (
                    <span className="text-green-400 text-sm flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Installed
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
