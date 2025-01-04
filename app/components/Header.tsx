import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="text-[#0154fa]">DeApe.fi
</span>
        </Link>
        <div className="space-x-6">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link>
          <Link href="/staking" className="text-gray-300 hover:text-white transition-colors">Staking</Link>
          <Link href="#" className="bg-[#0154fa] text-white px-4 py-2 rounded-md hover:bg-[#0143d1] transition-colors">
            Launch App
          </Link>
        </div>
      </nav>
    </header>
  )
}

