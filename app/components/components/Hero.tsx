import Image from 'next/image'

export default function Hero() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Unlock the Value of Your NFTs
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Borrow and lend against your Ape NFTs on the most secure platform in the ecosystem.
          </p>
          <button className="bg-[#0154fa] text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-[#0143d1] transition-colors">
            Get Started
          </button>
        </div>
        <div className="md:w-1/2">
          <div className="relative w-full h-80 md:h-96">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="NFT Lending Illustration"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

