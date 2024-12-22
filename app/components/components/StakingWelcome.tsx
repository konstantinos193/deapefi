'use client'

import Image from 'next/image'

const wallets = [
  { id: 'metamask', name: 'MetaMask', icon: '/wallet-icons/metamask.svg' },
  { id: 'okx', name: 'OKX Wallet', icon: '/wallet-icons/okx.svg' },
  { id: 'trust', name: 'Trust Wallet', icon: '/wallet-icons/trust.svg' },
  { id: 'rainbow', name: 'Rainbow', icon: '/wallet-icons/rainbow.svg' },
]

export default function StakingWelcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-4">
        Ape NFT
      </h1>
      <p className="text-gray-400 mb-8">
        Stake your Ape NFTs, earn rewards, and unlock exclusive benefits
      </p>
      <div className="w-full max-w-sm bg-[#1a1f2e] rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Connect Wallet</h2>
        <div className="space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className="w-full flex items-center p-3 rounded hover:bg-gray-700/50 transition-colors text-left"
            >
              <div className="w-6 h-6 relative mr-3">
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={24}
                  height={24}
                />
              </div>
              <span>{wallet.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
