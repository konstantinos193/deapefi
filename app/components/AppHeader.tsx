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
      <nav className="container mx-auto px-4 py-2 md:py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold text-white">
            <span className="text-[#0154fa]">DeApe</span>.fi
          </Link>
          <div className="flex items-center space-x-3 md:space-x-6">
            <NavItem href="/" icon={<Home size={18} className="md:w-5 md:h-5" />} text="Home" className="md:flex hidden" />
            <NavItem href="/staking" icon={<PieChart size={18} className="md:w-5 md:h-5" />} text="Staking" className="md:flex hidden" />
            <div className="flex md:hidden space-x-3">
              <Link href="/" className="text-gray-300 hover:text-white">
                <Home size={18} />
              </Link>
              <Link href="/staking" className="text-gray-300 hover:text-white">
                <PieChart size={18} />
              </Link>
            </div>
            {isStakingSection && (
              <div className="scale-90 md:scale-100">
                <WalletConnect />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  text: string
  className?: string
}

function NavItem({ href, icon, text, className = "" }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className={`items-center text-gray-300 hover:text-white transition-colors ${className}`}
    >
      {icon}
      <span className="ml-2 hidden md:inline">{text}</span>
    </Link>
  )
}
