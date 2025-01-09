'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Award } from 'lucide-react'

interface LeaderboardEntry {
  address: string;
  points: number;
}

export default function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_FRONTEND_API_KEY // Use the API key from the .env file
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setLeaderboard(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="bg-[#1a1b1f] rounded-lg overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-opacity-40">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-400">Rank</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-400">Address</th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-gray-400">Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((entry) => {
              const originalIndex = leaderboard.findIndex(e => e.address === entry.address);
              return (
                <tr key={entry.address} className={`border-b border-gray-700 hover:bg-gray-800 ${getRankStyle(originalIndex)}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getRankIcon(originalIndex)}
                      <span className={originalIndex < 3 ? 'ml-2' : ''}>
                        {originalIndex + 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono">{entry.address}</td>
                  <td className="py-4 px-4 text-right font-bold">{entry.points.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}