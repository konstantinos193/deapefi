import './globals.css'
import type { Metadata } from 'next'
import { WalletProvider } from './contexts/WalletContext'

export const metadata: Metadata = {
  title: 'DeApe.fi',
  description: 'Revolutionizing NFT finance on the Ape blockchain.',
  icons: {
    icon: 'https://i.imgur.com/5QhVrb8.png'
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
      <head>
  <meta property="og:title" content="DeApe.fi" />
  <meta property="og:description" content="Borrow APE using your NFT as collateral, and keep your NFT in your wallet. Lend APE to earn more APE, and receive the NFT if the loan isn’t repaid." />
  <meta property="og:image" content="https://res.cloudinary.com/dguz3xo20/image/upload/v1736471889/deapefi_ctasig.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://deape.fi" />
  <meta property="og:type" content="website" />
</head>


      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}

