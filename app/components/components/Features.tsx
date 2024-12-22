import { Zap, Shield, TrendingUp } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-12 h-12 text-[#0154fa]" />,
      title: "Instant Liquidity",
      description: "Get immediate access to funds by using your Ape NFTs as collateral."
    },
    {
      icon: <Shield className="w-12 h-12 text-[#0154fa]" />,
      title: "Secure Platform",
      description: "Built on Ape blockchain with top-tier security measures to protect your assets."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-[#0154fa]" />,
      title: "Competitive Rates",
      description: "Enjoy low interest rates for borrowers and attractive yields for lenders."
    }
  ]

  return (
    <section id="features" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose DeApe.fi
?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

