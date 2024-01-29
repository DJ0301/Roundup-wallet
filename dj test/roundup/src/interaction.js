import contractAbi from './contract.json';
import Web3 from 'web3';
import axios from 'axios';

const web3 = new Web3('https://replicator.pegasus.lightlink.io/rpc/v1');
const contractAddress = '0xbB15b1A4Fa50D81b46EA823f73995a98CE8B9FE0';
const contract = new web3.eth.Contract(contractAbi, contractAddress);

let isSavingsModeOn = false;

export function createWallet() {
  let wallet = web3.eth.accounts.create();
  console.log('New Wallet Created:');
  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);
  return wallet;
}

export function importWalletFromPrivateKey(privateKey) {
  const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log('Wallet Imported from Private Key:');
  console.log('Address:', wallet.address);
  return wallet;
}


export function importWalletFromMnemonic(mnemonic) {
  const wallet = web3.eth.accounts.wallet.create(1, mnemonic);
  console.log('Wallet Imported from Mnemonic:');
  console.log('Address:', wallet[0].address);
  return wallet[0];
}


export async function getBalance(address) {
  try {
    const balance = await web3.eth.getBalance(address);
    console.log(`Balance of ${address}:`, web3.utils.fromWei(balance, 'ether'), 'ETH');
    return web3.utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error('Error fetching balance:', error.message);
  }
}
export async function getContractBalance(senderAddress) {
  try {
    const balance = await contract.methods.getBalance().call({ from: senderAddress });
    console.log(balance);
    console.log(`Savings Balance of ${contractAddress}:`, web3.utils.fromWei(balance, 'ether'), 'ETH');
    return web3.utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error('Error fetching balance:', error.message);
  }
}


export function displayCurrentAddress(wallet) {
  console.log('Current Account Address:', wallet.address);
}

export async function getEthToUsdRate() {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=9844d305b168e69b123d44b8a6a22405561bdbe404564553cd31be10fc3226ce`);
  const ethToUsdRate = response.data.USD;
  console.log(`ETH to USD Rate: ${ethToUsdRate}`);
  return ethToUsdRate;
}

export async function ethToUSD(amountInETH) {
  const ethToUsdRate = await getEthToUsdRate();
  const amountInUSD = amountInETH * ethToUsdRate;
  console.log(`${amountInETH} ETH is approximately ${amountInUSD} USD`);
  return amountInUSD;
}

export function roundUpTo10s(amountInUSD) {
  if (isSavingsModeOn) {
    const roundedAmount = (Math.ceil(amountInUSD / 10) * 10) - amountInUSD;
    console.log(`Rounded Amount to Nearest 10s: ${roundedAmount} USD`);
    return roundedAmount;
  }
}
export async function sendETH(senderWallet, receiverAddress, amount) {
  try {
    if (!senderWallet || !senderWallet.address) {
      throw new Error('Sender address not available.');
    }

    const balance = await web3.eth.getBalance(senderWallet.address);
    console.log('Sender Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');

    const tx = {
      from: senderWallet.address,
      to: receiverAddress,
      value: web3.utils.toWei(amount, 'ether'),
      gas: 2000000, // Example gas limit
      gasPrice: web3.utils.toWei('10', 'gwei') // Example gas price
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, senderWallet.privateKey);
    const transaction = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction Sent:', transaction.transactionHash);

    const amountInUSD = await ethToUSD(amount);
    const roundedAmount = roundUpTo10s(parseFloat(amountInUSD));
    await sendRoundedAmount(senderWallet, roundedAmount);

    return transaction;
  } catch (error) {
    console.error('Error sending ETH:', error.message);
    throw error; // Re-throw the error to handle it in the caller function
  }
}

export async function sendRoundedAmount(senderWallet, roundedAmount) {
  if (isSavingsModeOn) {
    const ethToUsdRate = await getEthToUsdRate();
    const amountInETH = roundedAmount / ethToUsdRate;

    const tx = {
      from: senderWallet.address,
      to: contractAddress,
      value: web3.utils.toWei(amountInETH, 'ether'),
      gas: 2000000, // Example gas limit
      gasPrice: web3.utils.toWei('10', 'gwei') // Example gas price
    };

    const signedTx = await senderWallet.signTransaction(tx);
    const transaction = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Rounded Amount Sent to Contract:', transaction.transactionHash);
    return transaction;
  } else {
    console.log('Savings Mode is OFF. No savings-related actions performed.');
    return null;
  }
}

export async function savingsMode() {
  isSavingsModeOn = !isSavingsModeOn;
  console.log('Savings Mode is ', isSavingsModeOn.toString());
  return isSavingsModeOn;
}

export async function withdrawETH(amount, fromAddress, senderPrivateKey) {
  try {
    let amountInWei = web3.utils.toWei(amount, 'ether');

    // Estimate gas for the transaction
    const gasEstimate = await contract.methods.withdraw(amountInWei).estimateGas({ from: fromAddress });

    // Build the transaction data
    const transactionData = contract.methods.withdraw(amountInWei).encodeABI();

    // Build the transaction object with gas and gasPrice
    const transactionObject = {
      from: fromAddress,
      to: contractAddress,
      gas: gasEstimate, // Use the estimated gas value
      gasPrice: await web3.eth.getGasPrice(), // Get the current gas price from the network
      data: transactionData,
    };

    // Sign the transaction
    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, senderPrivateKey);

    // Send the signed transaction
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log('Withdrawal successful. Transaction hash:', transactionReceipt.transactionHash);
  } catch (error) {
    console.error('Error withdrawing funds:', error.message);
  }
}
