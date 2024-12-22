'use client'

import { useWallet } from '../contexts/WalletContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightCircle, ArrowLeftCircle } from 'lucide-react'
import { ethers } from 'ethers'
import { NFT_STAKING_ABI, NFT_COLLECTION_ABI } from '../utils/contractInterface'
import { STAKING_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from '../utils/constants'
import type { Ethereum } from '../types/global'

interface NFT {
  id: string
  name: string
  image: string
}

interface NFTListProps {
  title: string
  nfts: NFT[]
  action: string
  onAction: (nft: NFT) => Promise<void>
  actionIcon: React.ReactNode
}

interface NFTCardProps {
  nft: NFT
  action: string
  onAction: (nft: NFT) => Promise<void>
  actionIcon: React.ReactNode
}

interface ErrorDetails {
  message: string;
  data?: {
    message?: string;
    code?: string | number;
  };
  code?: string | number;
}

export default function StakingSession() {
  const { isConnected } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [unstakedNFTs, setUnstakedNFTs] = useState<NFT[]>([])
  const [stakedNFTs, setStakedNFTs] = useState<NFT[]>([])
  const [isApproved, setIsApproved] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchNFTs = async () => {
      if (!isConnected) {
        setIsLoading(false)
        return
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as Ethereum)
        const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, NFT_STAKING_ABI, provider)
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_COLLECTION_ABI, provider)
        const signer = provider.getSigner()
        const userAddress = await signer.getAddress()

        // Get staked NFTs in parallel
        const stakerInfo = await stakingContract.getStakerInfo(userAddress)
        const stakedTokenIds = stakerInfo.stakedTokens

        // Get owned NFTs in parallel
        const balancePromise = nftContract.balanceOf(userAddress)
        const totalSupplyPromise = nftContract.totalSupply()

        const [balance, totalSupply] = await Promise.all([balancePromise, totalSupplyPromise])

        console.log('NFT Balance:', balance.toString())
        console.log('Total Supply:', totalSupply.toString())

        const ownedTokens: ethers.BigNumber[] = []

        // Create array of token IDs to check
        for (let i = 1; i <= totalSupply.toNumber(); i++) {
          ownedTokens.push(ethers.BigNumber.from(i))
        }

        // Check ownership in parallel
        const ownerPromises = ownedTokens.map(id => 
          nftContract.ownerOf(id)
            .then((owner: string) => ({ id, owner }))
            .catch(() => ({ id, owner: null }))
        )

        const owners = await Promise.all(ownerPromises)
        const ownedTokenIds = owners
          .filter(({ owner }) => owner?.toLowerCase() === userAddress.toLowerCase())
          .map(({ id }) => id)

        console.log('Found owned tokens:', ownedTokenIds.map(id => id.toString()))
        
        // Filter out staked NFTs
        const stakedIds = new Set(stakedTokenIds.map((id: ethers.BigNumber) => id.toString()))

        // Fetch metadata for all NFTs in parallel
        const fetchMetadata = async (id: ethers.BigNumber) => {
          try {
            const tokenURI = await nftContract.tokenURI(id)
            const uri = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
            const response = await fetch(uri)
            const metadata = await response.json()
            return {
              id: id.toString(),
              name: metadata.name || `AEC #${id.toString()}`,
              image: metadata.image?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/') || `/nfts/${id.toString()}.png`
            }
          } catch (error) {
            console.log(`Error fetching metadata for token ${id}:`, error)
            return {
              id: id.toString(),
              name: `AEC #${id.toString()}`,
              image: `/nfts/${id.toString()}.png`
            }
          }
        }

        // Update the NFT data mapping with metadata
        const unstakedNFTsData = await Promise.all(
          ownedTokenIds
            .filter(id => !stakedIds.has(id.toString()))
            .map(id => fetchMetadata(id))
        )

        const stakedNFTsData = await Promise.all(
          stakedTokenIds.map((id: ethers.BigNumber) => fetchMetadata(id))
        )

        if (isMounted) {
          setStakedNFTs(stakedNFTsData)
          setUnstakedNFTs(unstakedNFTsData)
          
          // Check approval status
          const isApproved = await nftContract.isApprovedForAll(userAddress, STAKING_CONTRACT_ADDRESS)
          setIsApproved(isApproved)
          
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchNFTs()

    return () => {
      isMounted = false
    }
  }, [isConnected])

  const handleError = (error: ErrorDetails) => {
    console.error('Transaction error:', error)
    let errorMessage = 'Transaction failed'

    // Check for specific contract errors
    const errorMsg = error.data?.message || error.message
    if (errorMsg) {
      if (errorMsg.includes('NotTokenOwner')) {
        errorMessage = 'You do not own this NFT'
      } else if (errorMsg.includes('TokenAlreadyStaked')) {
        errorMessage = 'This NFT is already staked'
      } else if (errorMsg.includes('TokenNotStaked')) {
        errorMessage = 'This NFT is not staked'
      } else if (errorMsg.includes('ApprovalRequired')) {
        errorMessage = 'Please approve the contract to handle your NFTs'
      }
    }

    // You can add toast notification here
    console.error(errorMessage)
  }

  const handleStake = async (nft: NFT) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as Ethereum)
      const signer = provider.getSigner()
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, NFT_STAKING_ABI, signer)
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_COLLECTION_ABI, signer)
      
      // Check ownership
      const owner = await nftContract.ownerOf(nft.id)
      const userAddress = await signer.getAddress()
      if (owner.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error('NotTokenOwner')
      }

      // Check and set approval if needed
      if (!isApproved) {
        const approveTx = await nftContract.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true)
        await approveTx.wait()
        setIsApproved(true)
      }

      const tx = await stakingContract.stakeNFTs([nft.id])
      await tx.wait()
      
      setUnstakedNFTs(unstakedNFTs.filter(item => item.id !== nft.id))
      setStakedNFTs([...stakedNFTs, nft])
    } catch (err) {
      const error = err as ErrorDetails
      handleError(error)
    }
  }

  const handleUnstake = async (nft: NFT) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as Ethereum)
      const signer = provider.getSigner()
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, NFT_STAKING_ABI, signer)
      
      const tx = await stakingContract.unstakeNFTs([nft.id])
      await tx.wait()

      setStakedNFTs(stakedNFTs.filter(item => item.id !== nft.id))
      setUnstakedNFTs([...unstakedNFTs, nft])
    } catch (err) {
      const error = err as ErrorDetails
      handleError(error)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Wallet Connection Required</h2>
          <p className="text-gray-400">Please connect your wallet to manage your NFTs.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0154fa]"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <NFTList
          title="Available NFTs"
          nfts={unstakedNFTs}
          action="Stake"
          onAction={handleStake}
          actionIcon={<ArrowRightCircle className="w-5 h-5" />}
        />
        <NFTList
          title="Staked NFTs"
          nfts={stakedNFTs}
          action="Unstake"
          onAction={handleUnstake}
          actionIcon={<ArrowLeftCircle className="w-5 h-5" />}
        />
      </div>
    </div>
  )
}

function NFTList({ title, nfts, action, onAction, actionIcon }: NFTListProps) {
  return (
    <div className="flex-1">
      <h3 className="text-2xl font-semibold mb-6 text-white">{title}</h3>
      <div className="h-[500px] overflow-y-auto custom-scrollbar mb-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} action={action} onAction={onAction} actionIcon={actionIcon} />
          ))}
        </div>
      </div>
    </div>
  )
}

function NFTCard({ nft, action, onAction, actionIcon }: NFTCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-700 bg-opacity-50 rounded-lg overflow-hidden"
    >
      <div className="relative aspect-square">
        <Image 
          src={nft.image} 
          alt={nft.name} 
          width={200} 
          height={200} 
          className="w-full h-full object-contain"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
        <h4 className="absolute bottom-2 left-2 text-sm font-semibold text-white">{nft.name}</h4>
      </div>
      <div className="p-2">
        <button
          onClick={() => onAction(nft)}
          className={`w-full py-1.5 px-3 rounded text-sm text-white font-semibold transition-colors flex items-center justify-center ${
            action === 'Stake' ? 'bg-[#0154fa] hover:bg-[#0143d1]' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {action}
          <span className="ml-1.5">{actionIcon}</span>
        </button>
      </div>
    </motion.div>
  )
}
