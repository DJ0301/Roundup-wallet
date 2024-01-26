import contractAbi from './contract.json';

const ethers = require('ethers');
const axios = require('axios');
const provider = new ethers.providers.JsonRpcProvider('https://replicator.pegasus.lightlink.io/rpc/v1	');
const signer = provider.getSigner();
const contractAddress = '0x37377eb4e0cd75afb2bb657154599e566af240bf';
const contract = new ethers.Contract(contractAddress, contractAbi, signer);

let isSavingsModeOn = false;

export function createWallet() {
  const wallet = ethers.Wallet.createRandom();
  console.log('New Wallet Created:');
  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);
  console.log('Mnemonic Phrase:', wallet.mnemonic.phrase);
  return wallet;
}

export function importWalletFromPrivateKey(privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  console.log('Wallet Imported from Private Key:');
  console.log('Address:', wallet.address);
  return wallet;
}

// Function to import a wallet from a mnemonic phrase
export function importWalletFromMnemonic(mnemonic) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  console.log('Wallet Imported from Mnemonic:');
  console.log('Address:', wallet.address);
  return wallet;
}

// Function to get the balance of an address
export async function getBalance(address) {
  try {
    const contractBalance = await contract.getBalance();
    console.log('Contract Balance:', ethers.utils.formatEther(contractBalance), 'ETH');
    return contractBalance;
  } catch (error) {
    if (error.code === 'UNSUPPORTED_OPERATION') {
      console.error('Error fetching contract balance: Unsupported operation. Make sure the signer has an associated account.');
    } else {
      console.error('Error fetching contract balance:', error.message);
    }
  } 
}

// Function to send ETH from one wallet to another
export async function sendETH(senderWallet, receiverAddress, amount) {
  const tx = {
    to: receiverAddress,
    value: ethers.utils.parseEther(amount),
  };

  const signedTx = await senderWallet.signTransaction(tx);
  const transaction = await provider.sendTransaction(signedTx);
  console.log('Transaction Sent:', transaction.hash);

  // Call sendRoundedAmount function with a rounded amount
  const amountInUSD = await ethToUSD(amount);
  const roundedAmount = roundUpTo10s(parseFloat(amountInUSD));
  await sendRoundedAmount(senderWallet, roundedAmount);

  return transaction;
}

// Function to receive ETH - Displays a QR code with the wallet address
export function receiveETH(wallet) {
  
}

// Function to display the current account's public address
export function displayCurrentAddress(wallet) {
  console.log('Current Account Address:', wallet.address);
}

// Function to get the conversion rate from ETH to USD using CryptoCompare API
export async function getEthToUsdRate() {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=9844d305b168e69b123d44b8a6a22405561bdbe404564553cd31be10fc3226ce`);
  const ethToUsdRate = response.data.USD;
  console.log(`ETH to USD Rate: ${ethToUsdRate}`);
  return ethToUsdRate;
}

// Function to convert ETH amount to USD using CryptoCompare API
export async function ethToUSD(amountInETH) {
  const ethToUsdRate = await getEthToUsdRate();
  const amountInUSD = amountInETH * ethToUsdRate;
  console.log(`${amountInETH} ETH is approximately ${amountInUSD} USD`);
  return amountInUSD;
}

// Function to round up the amount in dollars to the nearest 10s place
export function roundUpTo10s(amountInUSD) {
  if(isSavingsModeOn)
  {
  const roundedAmount = (Math.ceil(amountInUSD / 10) * 10) - amountInUSD;
  console.log(`Rounded Amount to Nearest 10s: ${roundedAmount} USD`);
  return roundedAmount;
}}

// Function to send the rounded amount to another contract address
export async function sendRoundedAmount(wallet, roundedAmount) {
  if (isSavingsModeOn) {
    // Convert the rounded amount in USD to Ether using CryptoCompare API
    const ethToUsdRate = await getEthToUsdRate();
    const amountInETH = roundedAmount / ethToUsdRate;

    const tx = {
      to: contractAddress,
      value: ethers.utils.parseEther(amountInETH.toString()),
    };

    const signedTx = await wallet.signTransaction(tx);
    const transaction = await provider.sendTransaction(signedTx);
    console.log('Rounded Amount Sent to Contract:', transaction.hash);
    return transaction;
  } else {
    console.log('Savings Mode is OFF. No savings-related actions performed.');
    return null; // You can choose to return a specific value or null when not in savings mode
  }
}

// New Function: Savings Mode
export async function savingsMode() {
  isSavingsModeOn = !isSavingsModeOn;
  console.log('Savings Mode is ',isSavingsModeOn.toString());
  }

  export async function withdrawETH(amount) {
    const tx = await contract.withdraw(amount);
    console.log('Withdrawal Transaction:', tx.hash);
    return tx;
  }

// // Example Usage
async function main() {
  // Create a new wallet
  // const newWallet = createWallet();

//   // Import a wallet from private key
//   const privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
//   const importedWalletFromPrivateKey = importWalletFromPrivateKey(privateKey);

//   // Import a wallet from mnemonic phrase
//   const mnemonic = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12';
//   const importedWalletFromMnemonic = importWalletFromMnemonic(mnemonic);

//   // Get balance of the imported wallets
//   await getBalance(importedWalletFromPrivateKey.address);
//   await getBalance(importedWalletFromMnemonic.address);

//   // Send ETH from the new wallet to an imported wallet
//   const receiverAddress = '0x1234567890123456789012345678901234567890';
//   const amountToSend = '0.05';
//   await sendETH(newWallet, receiverAddress, amountToSend);

//   // Get updated balance after sending ETH
//   await getBalance(importedWalletFromPrivateKey.address);
//   await getBalance(importedWalletFromMnemonic.address);

//   // Convert ETH to USD using CryptoCompare API
//   const amountInETH = '0.1';
//   const amountInUSD = await ethToUSD(amountInETH);

//   // Round up the amount in dollars to the nearest 10s place
//   const roundedAmount = roundUpTo10s(parseFloat(amountInUSD));
//   console.log(`Rounded Amount: ${roundedAmount} USD`);

//   // Send the rounded amount to another contract address
//   await sendRoundedAmount(newWallet, roundedAmount);

//   // Receive ETH to the new wallet
//   receiveETH(newWallet);

//   // Display the current account's public address
//   displayCurrentAddress(newWallet);

//   // Execute savings mode
//   await savingsMode(newWallet);
}

main();
