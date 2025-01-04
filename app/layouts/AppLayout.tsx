import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <AppFooter />
    </div>
  )
} 
