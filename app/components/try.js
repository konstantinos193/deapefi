const { ethers } = require('ethers');

// Replace with your provider URL and contract details
const provider = new ethers.providers.JsonRpcProvider('https://apechain.calderachain.xyz/http');
const contractAddress = '0xddbcc239527dedd5e0c761042ef02a7951cec315';
const contractABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function fetchInteractingAddresses() {
  try {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const startBlock = 6970654;
    const endBlock = await provider.getBlockNumber();
    const filter = {
      address: contractAddress,
      fromBlock: startBlock,
      toBlock: endBlock
    };

    const logs = await provider.getLogs(filter);
    const addresses = new Set();

    logs.forEach(log => {
      if (log.topics.length > 1) {
        const address = ethers.utils.getAddress(`0x${log.topics[1].slice(26)}`);
        addresses.add(address);
      }
    });

    for (const address of addresses) {
      const points = await contract.getPoints(address);
      console.log(`Address: ${address}, Points: ${points.toString()}`);
    }
  } catch (error) {
    console.error('Error fetching interacting addresses:', error);
  }
}

fetchInteractingAddresses();