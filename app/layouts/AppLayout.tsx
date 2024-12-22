import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main>
        {children}
      </main>
      <AppFooter />
    </div>
  )
} 