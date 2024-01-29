import contractAbi from './NFTcontract.json';
import Web3 from 'web3';
import axios from 'axios';
import generateNFTImage from "./nftImage";

const web3 = new Web3('https://replicator.pegasus.lightlink.io/rpc/v1');
const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const contract = new web3.eth.Contract(contractAbi, contractAddress);


export async function generateNFT( to, tokenId, uri) {
  try {
      // Call the safeMint function of the contract
      const result = await contract.methods.safeMint(to, tokenId, uri).send({ from: to });

      console.log('NFT minted successfully. Transaction hash:', result.transactionHash);
  } catch (error) {
      console.error('Error minting NFT:', error);
  }
}

  
  // Example usage