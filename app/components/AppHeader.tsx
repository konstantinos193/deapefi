'use client'

import Link from 'next/link'
import { Home, PieChart } from 'lucide-react'
import WalletConnect from './WalletConnect'
import { usePathname } from 'next/navigation'

export default function AppHeader() {
  const pathname = usePathname()
  const isStakingSection = pathname?.includes('/staking')

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border-b border-gray-700">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="text-[#0154fa]">DeApe</span>.fi
          </Link>
          <div className="flex items-center space-x-6">
            <NavItem href="/" icon={<Home size={20} />} text="Home" />
            <NavItem href="/staking" icon={<PieChart size={20} />} text="Staking" />
            {isStakingSection && <WalletConnect />}
          </div>
        </div>
      </nav>
    </header>
  )
}

// Define prop types for NavItem component
interface NavItemProps {
  href: string
  icon: React.ReactNode
  text: string
}

function NavItem({ href, icon, text }: NavItemProps) {
  return (
    <Link href={href} className="flex items-center text-gray-300 hover:text-white transition-colors">
      {icon}
      <span className="ml-2">{text}</span>
    </Link>
  )
}
