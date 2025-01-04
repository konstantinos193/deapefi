import AppLayout from '../../layouts/AppLayout'
import StakingSession from '../../components/StakingSession'

export default function StakingSessionPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <p className="text-xl text-center text-gray-300 mb-12">
          Stake your Ape NFTs to earn rewards and unlock exclusive benefits in the DeApe.fi ecosystem.
        </p>
        <StakingSession />
      </div>
    </AppLayout>
  )
}

