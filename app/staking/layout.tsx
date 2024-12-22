'use client'

import AppLayout from '../layouts/AppLayout'

export default function StakingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        {children}
      </div>
    </AppLayout>
  )
} 