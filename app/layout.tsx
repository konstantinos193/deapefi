import './globals.css'
import type { Metadata } from 'next'
import { WalletProvider } from './contexts/WalletContext'
import { SessionProvider } from './contexts/SessionContext'
import { Suspense } from 'react'

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
  console.log('Layout rendering, styles should be applied')
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100">
        <WalletProvider>
          <SessionProvider>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </SessionProvider>
        </WalletProvider>
      </body>
    </html>
  )
}

