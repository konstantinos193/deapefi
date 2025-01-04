'use client'

import dynamic from 'next/dynamic'
import { WalletProvider as BaseWalletProvider } from '../contexts/WalletContext'

export const WalletProvider = dynamic(
  () => Promise.resolve(BaseWalletProvider),
  { ssr: false }
) 