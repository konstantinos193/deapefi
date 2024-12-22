'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '../../contexts/WalletContext'
import StakingSession from '../../components/StakingSession'

export default function ManagePage() {
  const { isConnected } = useWallet()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && !isConnected) {
      router.replace('/staking')
    }
  }, [isConnected, router, mounted])

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0154fa]"></div>
      </div>
    )
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
      <h1 className="text-4xl font-bold mb-8 text-white">Manage NFT Staking</h1>
      <StakingSession />
    </div>
  )
}