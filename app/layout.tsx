import './globals.css'
import type { Metadata } from 'next'
import { WalletProvider } from './contexts/WalletContext'

export const metadata: Metadata = {
  title: 'DeApe.fi',
  description: 'Revolutionizing NFT finance on the Ape blockchain.',
  icons: {
    icon: 'https://i.imgur.com/2dGT2zz.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}

