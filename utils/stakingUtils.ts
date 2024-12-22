export function calculateStakingRewards(nfts: number, days: number, isMinter: boolean): number {
  let points = nfts * 5 * days // 5 points per day per NFT
  
  if (isMinter) {
    points += 1000 // 1000 points for minters
  }
  
  if (nfts >= 10) {
    points *= 2 // 2X multiplier if holding 10 or more NFTs
  }
  
  return Math.floor(points)
}

