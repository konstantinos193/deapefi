export const NFT_STAKING_ABI = [
  "function stakeNFTs(uint256[] calldata tokenIds) external",
  "function unstakeNFTs(uint256[] calldata tokenIds) external",
  "function getStakerInfo(address _staker) external view returns (uint256[] memory stakedTokens, uint256 totalPoints, uint256 tier, bool isMinter)",
  "function getLeaderboard(uint256 limit) external view returns (tuple(address[] users, uint256[] points))",
  "function getPoints(address _user) external view returns (uint256)",
  "event NFTsStaked(address indexed user, uint256[] tokenIds)",
  "event NFTsUnstaked(address indexed user, uint256[] tokenIds)",
  "error NotTokenOwner()",
  "error TokenAlreadyStaked()",
  "error TokenNotStaked()",
  "error ApprovalRequired()"
]

export const NFT_COLLECTION_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 tokenId) external",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function totalSupply() external view returns (uint256)",
  "function tokenByIndex(uint256 index) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
] 