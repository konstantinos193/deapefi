'use client'

import { PieChart, Gem, Trophy } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

export default function StakingPage() {
  const { isConnected } = useWallet()
  const router = useRouter()

  const CardWrapper = ({ path, children }: { path: string, children: React.ReactNode }) => {
    if (!isConnected && path !== '/staking/leaderboard') {
      return (
        <div 
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl transition-all cursor-not-allowed opacity-75"
        >
          {children}
        </div>
      )
    }

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl transition-all hover:bg-opacity-70 cursor-pointer"
        onClick={() => router.push(path)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-6 text-center text-white">
          Ape NFT <span className="text-[#0154fa]">Staking</span>
        </h1>
        <p className="text-xl text-center text-gray-300 mb-12">
          Stake your Ape NFTs, earn rewards, and unlock exclusive benefits in the DeApe.fi ecosystem.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <CardWrapper path="/staking/dashboard">
          <div className="text-[#0154fa] mb-4">
            <PieChart size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Staking Dashboard</h2>
          <p className="text-gray-300">Monitor your staked NFTs and earned rewards</p>
          {!isConnected && (
            <div className="mt-4 text-sm text-red-400">
              Wallet connection required
            </div>
          )}
          <Link href="/staking/dashboard" className="mt-4 text-sm text-blue-400">
            Go to Dashboard
          </Link>
        </CardWrapper>

        <CardWrapper path="/staking/manage">
          <div className="text-[#0154fa] mb-4">
            <Gem size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Manage NFTs</h2>
          <p className="text-gray-300">Stake and unstake your Ape NFTs</p>
          {!isConnected && (
            <div className="mt-4 text-sm text-red-400">
              Wallet connection required
            </div>
          )}
        </CardWrapper>

        <CardWrapper path="/staking/leaderboard">
          <div className="text-[#0154fa] mb-4">
            <Trophy size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Staking Leaderboard</h2>
          <p className="text-gray-300">Compete with other stakers for top rewards</p>
        </CardWrapper>
      </motion.div>
    </Suspense>
  )
}

