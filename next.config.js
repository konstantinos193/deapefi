/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.w3s.link',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
        port: '',
        pathname: '/**',
      }
    ],
    domains: [
      'i.imgur.com', 
      'img-cdn.magiceden.dev', 
      's2.coinmarketcap.com', 
      'placehold.co', 
      'img.reservoir.tools', 
      'gateway.pinata.cloud', 
      'api.dicebear.com', 
      'example.com', 
      'ipfs.io', 
      'cloudflare-ipfs.com', 
      'dweb.link', 
      'cf-ipfs.com', 
      'w3s.link',
      'bafybeihzg2ijidwcjsll7qgqkniu3k5azzdy2hda26dbf5e2lginzvlvzy.ipfs.w3s.link',
      // Adding new IPFS gateways
      '4everland.io',
      'nftstorage.link',
      'hardbin.com',
      'infura-ipfs.io',
      'ipfs.eth.aragon.network',
      'jorropo.net',
      'ipfs.best-practice.se',
      'ipfs.fleek.co',
      'ipfs.drink.cafe',
      'ipfs.litnet.work'
    ],
  },
  webpack: (config) => {
    if (!config.resolve) {
      config.resolve = {}
    }
    if (!config.resolve.fallback) {
      config.resolve.fallback = {}
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      assert: require.resolve('assert'),
      os: require.resolve('os-browserify'),
      path: require.resolve('path-browserify'),
    }

  return config
},
}

module.exports = nextConfig