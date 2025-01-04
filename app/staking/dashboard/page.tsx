'use client'

import StakingDashboard from '../../components/StakingDashboard'
import { useWallet } from '../../contexts/WalletContext'

export default function DashboardPage() {
  const { isConnected } = useWallet()

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <p className="text-xl text-gray-400">Please connect your wallet to view the dashboard</p>
      </div>
    )
  }

  return <StakingDashboard />
}

