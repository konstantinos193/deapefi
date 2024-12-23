'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { STAKING_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from '../utils/constants'
import { NFT_STAKING_ABI, NFT_COLLECTION_ABI } from '../utils/contractInterface'
import { Trophy, Medal, Award } from 'lucide-react'

// Optional: If you want to use the ErrorDetails interface for structured error handling
interface ErrorDetails {
  message: string;
  data?: unknown;
  code?: string | number;
}

interface LeaderboardEntry {
  address: string;
  points: number;
}

interface WindowWithEthereum {
  ethereum: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  }
}

export default function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentAddress, setCurrentAddress] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchLeaderboard = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()
      setCurrentAddress(userAddress.toLowerCase())

      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, NFT_STAKING_ABI, provider)
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_COLLECTION_ABI, provider)

      // Get total supply of NFTs
      const totalSupply = await nftContract.totalSupply()
      console.log('Total NFTs:', totalSupply.toString())

      // Get all NFT owners
      const ownerPromises = []
      for (let i = 1; i <= totalSupply.toNumber(); i++) {
        ownerPromises.push(
          nftContract.ownerOf(i)
            .then((owner: string) => owner.toLowerCase())
            .catch(() => null)
        )
      }

      const owners = await Promise.all(ownerPromises)
      const uniqueOwners = [...new Set(owners.filter(owner => owner !== null))]
      console.log('Unique owners:', uniqueOwners)

      // Get points for each owner
      const pointsPromises = uniqueOwners.map(async (address) => {
        try {
          const points = await stakingContract.getPoints(address)
          return {
            address,
            points: points.toNumber()
          }
        } catch (error) {
          console.log(`Error getting points for ${address}:`, error)
          return null
        }
      })

      const allPoints = await Promise.all(pointsPromises)

      // Filter out null entries and sort by points
      const validEntries = allPoints
        .filter((entry): entry is LeaderboardEntry => entry !== null && entry.points > 0)
        .sort((a, b) => b.points - a.points)

      console.log('Leaderboard entries:', validEntries)
      setLeaderboard(validEntries)
      setIsLoading(false)
    } catch (error) {
      const typedError = error as ErrorDetails; // Use the ErrorDetails interface for better error typing
      console.error('Error fetching leaderboard:', typedError.message);
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    // Update every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)

    return () => clearInterval(interval)
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return null
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 0:
        return 'bg-yellow-400/10 border-yellow-400/50'
      case 1:
        return 'bg-gray-300/10 border-gray-300/50'
      case 2:
        return 'bg-amber-600/10 border-amber-600/50'
      default:
        return 'border-gray-700/50'
    }
  }

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0154fa]"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded bg-[#1a1b1f] border border-gray-700 text-white"
        />
      </div>

      <div className="bg-[#1a1b1f] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-opacity-40">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-400">Rank</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-400">Address</th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-gray-400">Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((entry, index) => (
              <tr 
                key={entry.address}
                className={`border-b border-gray-700 hover:bg-gray-800 
                  ${entry.address.toLowerCase() === currentAddress ? 'bg-blue-900 bg-opacity-20' : ''}`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    {getRankIcon(index)}
                    <span className={index < 3 ? 'ml-2' : ''}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 font-mono">
                  {entry.address.toLowerCase() === currentAddress ? (
                    <span className="text-blue-400">You</span>
                  ) : (
                    `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`
                  )}
                </td>
                <td className="py-4 px-4 text-right font-bold">
                  {entry.points.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
