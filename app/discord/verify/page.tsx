'use client'

import { Providers } from '../../components/Providers'
import dynamic from 'next/dynamic'

// Create a client-only version of DiscordProfile
const DynamicDiscordProfile = dynamic(
  () => import('../../components/DiscordProfile'),
  { ssr: false }
)

export default function VerifyPage() {
  return (
    <Providers>
      <DynamicDiscordProfile />
    </Providers>
  )
} 