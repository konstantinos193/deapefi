export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Link your Ape wallet to our platform securely."
    },
    {
      number: "02",
      title: "Select NFTs",
      description: "Choose the Ape NFTs you want to use as collateral."
    },
    {
      number: "03",
      title: "Get Loan Terms",
      description: "Review and accept the loan terms and conditions."
    },
    {
      number: "04",
      title: "Receive Funds",
      description: "Get instant liquidity in your wallet."
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <div className="text-[#0154fa] text-4xl font-bold mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

