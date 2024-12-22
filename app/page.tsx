'use client'

import AppLayout from './layouts/AppLayout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gem, TrendingUp, Trophy } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white text-center">{title}</h3>
      <p className="text-gray-300 text-center">{description}</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 text-white">
            Welcome to <span className="text-[#0154fa]">DeApe.fi</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Maximize the value of your Ape NFTs through our cutting-edge staking platform. Earn rewards and unlock exclusive benefits in the DeApe.fi ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 flex justify-center"
        >
          <Link 
            href="/staking" 
            className="bg-[#0154fa] text-white px-8 py-4 rounded-xl text-xl font-semibold hover:bg-[#0143d1] transition-colors inline-block shadow-lg hover:shadow-xl"
          >
            Start Staking Now
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Why Stake Your Ape NFTs?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Gem className="w-12 h-12 text-[#0154fa]" />}
              title="Earn Rewards"
              description="Stake your AEC NFTs and earn Staking Points as rewards. The longer you stake, the more you earn."
            />
            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-[#0154fa]" />}
              title="Increase Value"
              description="By staking, you contribute to the ecosystem's growth, potentially increasing the value of your NFTs."
            />
            <FeatureCard
              icon={<Trophy className="w-12 h-12 text-[#0154fa]" />}
              title="Exclusive Benefits"
              description="Gain access to exclusive features, airdrops, and community events by staking your AEC NFTs."
            />
          </div>
        </motion.div>
      </div>
    </AppLayout>
  )
}

