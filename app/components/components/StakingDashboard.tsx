'use client'

import { useWallet } from '../contexts/WalletContext'
import { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ethers } from 'ethers'
import { NFT_STAKING_ABI } from '../utils/contractInterface'
import { STAKING_CONTRACT_ADDRESS } from '../utils/constants'
import type { Ethereum } from '../types/global'

interface PointsHistory {
  day: number
  rewards: number
}

interface StakerInfo {
  stakedNFTs: number
  totalPoints: string
  tier: string
  isMinter: boolean
  lastUpdate?: number
}

function generatePointsHistory(totalPoints: number): PointsHistory[] {
  // If no points, return empty history
  if (totalPoints === 0) return []

  const history: PointsHistory[] = []
  const days = 30 // Show last 30 days
  
  // Create a growth curve that ends at the total points
  for (let i = 1; i <= days; i++) {
    // Use a logarithmic growth curve
    const progress = i / days
    const points = Math.floor(totalPoints * (Math.log10(progress * 9 + 1)))
    
    history.push({
      day: i,
      rewards: Math.max(0, points) // Ensure no negative values
    })
  }

  // Ensure the last point matches exactly the total points
  if (history.length > 0) {
    history[history.length - 1].rewards = totalPoints
  }

  return history
}

export default function StakingDashboard() {
  const { isConnected, address } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [stakerInfo, setStakerInfo] = useState<StakerInfo | null>(null)
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([])
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0)
  const [basePoints, setBasePoints] = useState<number>(0)
  const [calculatedPoints, setCalculatedPoints] = useState<number>(0)

  const calculateRealTimePoints = (basePoints: number, stakedCount: number, lastUpdate: number) => {
    const now = Date.now() / 1000
    const timeElapsed = now - lastUpdate
    const daysElapsed = Math.floor(timeElapsed / 86400) // Full days only

    if (daysElapsed > 0 && stakedCount > 0) {
      // Apply multiplier if 10 or more NFTs staked
      const multiplier = stakedCount >= 10 ? 2 : 1
      
      // Calculate points exactly like the contract:
      // daysElapsed * POINTS_PER_DAY * stakedCount * multiplier
      const earnedPoints = daysElapsed * 5 * stakedCount * multiplier

      return basePoints + earnedPoints
    }

    return basePoints // Return base points if no full days elapsed
  }

  useEffect(() => {
    const fetchStakerData = async () => {
      if (!isConnected) return
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as Ethereum)
        const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, NFT_STAKING_ABI, provider)
        
        const info = await stakingContract.getStakerInfo(address)
        const [stakedTokens, totalPoints, tier, isMinter] = info

        const statsData: StakerInfo = {
          stakedNFTs: Array.isArray(stakedTokens) ? stakedTokens.length : 0,
          totalPoints: ethers.utils.formatUnits(totalPoints, 0),
          tier: ethers.utils.formatUnits(tier, 0),
          isMinter: Boolean(isMinter)
        }

        setStakerInfo(statsData)
        setBasePoints(Number(statsData.totalPoints))
        setLastUpdateTime(Math.floor(Date.now() / 1000))
        
        // Generate points history
        const history = generatePointsHistory(Number(statsData.totalPoints))
        setPointsHistory(history)
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching staker data:', error)
        setIsLoading(false)
      }
    }

    fetchStakerData()
    const fetchInterval = setInterval(fetchStakerData, 60000) // Refresh data every minute

    return () => clearInterval(fetchInterval)
  }, [isConnected, address])

  // Update points calculation every second
  useEffect(() => {
    if (!stakerInfo || !lastUpdateTime) return

    const updatePoints = () => {
      const newPoints = calculateRealTimePoints(
        basePoints,
        stakerInfo.stakedNFTs,
        lastUpdateTime
      )
      setCalculatedPoints(newPoints)
    }

    // Initial calculation
    updatePoints()

    // Update every second
    const interval = setInterval(updatePoints, 1000)

    return () => clearInterval(interval)
  }, [stakerInfo, basePoints, lastUpdateTime])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Connection Required</h2>
          <p className="text-gray-400 mb-4">Please connect your wallet to access the staking dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-[#1a1f2e] border-[#2a2f3e]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-400">Staked AEC NFTs</h3>
            <span className="text-gray-400">⌚</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            {stakerInfo?.stakedNFTs ?? 0}
          </p>
        </Card>

        <Card className="p-6 bg-[#1a1f2e] border-[#2a2f3e]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-400">Total Points</h3>
            <span className="text-gray-400">💎</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            {calculatedPoints.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 bg-[#1a1f2e] border-[#2a2f3e]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-400">Tier</h3>
            <span className="text-gray-400">ⓘ</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            {stakerInfo?.tier ?? '0'}
          </p>
        </Card>

        <Card className="p-6 bg-[#1a1f2e] border-[#2a2f3e]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-400">Minter Status</h3>
            <span className="text-gray-400">↗</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            {stakerInfo?.isMinter ? 'Yes' : 'No'}
          </p>
        </Card>
      </div>

      {/* Points Growth Chart */}
      <Card className="p-6 bg-[#1a1f2e] border-[#2a2f3e]">
        <h3 className="text-xl font-semibold text-white mb-4">Points Growth</h3>
        <div className="w-full h-[300px]">
          <LineChart
            width={1200}
            height={300}
            data={pointsHistory}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3e" />
            <XAxis 
              dataKey="day" 
              stroke="#4b5563" 
              tick={{ fill: '#4b5563' }}
            />
            <YAxis 
              stroke="#4b5563" 
              tick={{ fill: '#4b5563' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1f2e', 
                border: '1px solid #2a2f3e',
                color: '#fff'
              }}
              formatter={(value: number) => [`${value} Points`, 'Points']}
            />
            <Line
              type="monotone"
              dataKey="rewards"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
            />
          </LineChart>
        </div>
      </Card>

      {/* Staking Points Section */}
      <Card className="p-6 bg-[#1a1f2e] border-[#2a2f3e]">
        <h3 className="text-xl font-semibold text-white mb-2">Staking Points</h3>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-semibold text-blue-500">
              {calculatedPoints.toLocaleString()} Points
            </p>
            <p className="text-sm text-gray-400">
              Current points based on your AEC NFT staking position
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

