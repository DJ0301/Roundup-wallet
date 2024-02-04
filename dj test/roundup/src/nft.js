import contractAbi from './NFTcontract.json';
import Web3 from 'web3';


const web3 = new Web3('https://replicator.pegasus.lightlink.io/rpc/v1');
const contractAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8';
const contract = new web3.eth.Contract(contractAbi, contractAddress);


export async function generateNFT(to, tokenId, uri,senderPrivateKey) {
  try {
    // Get the current gas price from the network
    const gasPrice = await web3.eth.getGasPrice();
    // Estimate gas for the transaction
    const gasEstimate = await contract.methods.safeMint(to, tokenId, uri).estimateGas({ from: to });
    // Build the transaction object
    const transactionObject = {
      from: to,
      to: contract.options.address,
      gas: gasEstimate,
      gasPrice: gasPrice,
      data: contract.methods.safeMint(to, tokenId, uri).encodeABI(),
    };
    // Sign the transaction
    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, senderPrivateKey);
    // Send the signed transaction
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log('NFT minted successfully. Transaction hash:', transactionReceipt.transactionHash);
  } catch (error) {
    console.error('Error minting NFT:', error.message);
  }
}
  
  // Example usage