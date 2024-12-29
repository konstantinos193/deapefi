import { NextResponse } from 'next/server';
import { providers, Contract } from 'ethers';

const NFT_CONTRACT_ADDRESS = '0x485242262f1e367144fe432ba858f9ef6f491334';
const STAKING_CONTRACT_ADDRESS = '0xddbcc239527dedd5e0c761042ef02a7951cec315';

const STAKING_ABI = [
  'function getUserStakedTokens(address _user) view returns (uint256[])',
  'function getUserInfo(address _user) view returns (tuple(uint256[] stakedTokens, uint256 totalPoints, bool isMinter))',
  'function getStakedTokens(address _user) view returns (uint256[])'
];

const NFT_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function tokenOfOwnerByIndex(address, uint256) view returns (uint256)'
];

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    console.log('Checking NFTs for address:', address);

    // Create a basic provider
    const provider = new providers.JsonRpcProvider('https://rpc1.apechain.com/v1/');
    
    // Wait for provider to be ready
    await provider.ready;
    console.log('Provider ready');

    // Create contract instances
    const stakingContract = new Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);

    // Get staked tokens
    let stakedTokens: string[] = [];
    try {
      console.log('Fetching staked tokens...');
      const result = await stakingContract.getUserStakedTokens(address);
      stakedTokens = result.map((t: any) => t.toString());
      console.log('Staked tokens:', stakedTokens);
    } catch (e) {
      console.log('getUserStakedTokens failed:', e);
    }

    // Get owned NFTs
    let ownedTokens: string[] = [];
    try {
      console.log('Fetching owned NFTs...');
      const balance = await nftContract.balanceOf(address);
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
        ownedTokens.push(tokenId.toString());
      }
      console.log('Owned tokens:', ownedTokens);
    } catch (e) {
      console.log('NFT balance check failed:', e);
    }

    // Return the results
    return NextResponse.json({
      address,
      ownedNFTs: ownedTokens,
      stakedNFTs: stakedTokens,
      totalNFTs: ownedTokens.length + stakedTokens.length
    });

  } catch (error: any) {
    console.error('Error checking NFTs:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check NFTs', 
        details: error.message,
        contractAddresses: {
          nft: NFT_CONTRACT_ADDRESS,
          staking: STAKING_CONTRACT_ADDRESS
        }
      },
      { status: 500 }
    );
  }
}
