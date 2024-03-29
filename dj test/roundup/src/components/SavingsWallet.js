import React, { useState, useEffect } from 'react';
import { withdrawETH, getContractBalance } from '../interaction.js'; // Import the withdrawETH and getSavingsBalance functions
import { generateNFT } from '../nft.js'; // Import the generateNFT function
import { wallet } from './ExportFuncs.js';
import { generateNFTImage, uploadImage, uploadMetadata } from '../nftImage';
import './SavingsWallet.css';
const currentDate = new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit'
}).replace(/\//g, '-');
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
const dd = String(today.getDate()).padStart(2, '0');
const fullDate = parseInt(`${yyyy}${mm}${dd}`);

const SavingsWallet = () => {
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  useEffect(() => {
    fetchSavingsBalance();
  }, []);

  const fetchSavingsBalance = async () => {
    try {
      const balance = await getContractBalance(wallet.address);
      setSavingsBalance(balance);
    } catch (error) {
      console.error('Error fetching savings balance:', error.message);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
      setWithdrawError('Invalid withdraw amount.');
      return;
    }

    try {
      await withdrawETH(parseFloat(withdrawAmount), wallet.address, wallet.privateKey);
      setWithdrawSuccess(true);
      await fetchSavingsBalance(); // Update balance after withdrawal
    } catch (error) {
      setWithdrawError(`Error withdrawing from savings: ${error.message}`);
    }
  };

  const handleGenerateNFT = async () => {
    try {
      const today = new Date().getDay();
        // if (today !== 5) {
        //     alert('NFT generation only occurs on Fridays!');
        //     return; 
        // }
        const savingsMessage = `You have now saved ${savingsBalance} ETH !`;
        await generateNFTImage(savingsMessage);
        const imageCID = await uploadImage(`/Users/dhananjayjoshi/Documents/GitHub/Roundup-wallet/dj test/roundup/${currentDate}.svg`);
        console.log(imageCID);
        const metadataCid = await uploadMetadata(imageCID)
        console.log('Metadata uploaded successfully!');
        await generateNFT(wallet.address, fullDate, `ipfs://${metadataCid}`,wallet.privateKey);
        console.log('Friday NFT generated successfully!');
        alert('NFT generated ! \n\n View here : ipfs:// \n\n (If there is no URL then error in generation. Please check funds)',metadataCid);
    } catch (error) {
      console.error('Error generating Friday NFT:', error.message);
    }
  };

  const handleUpdateBalance = async () => {
    await fetchSavingsBalance();
  };

    return (
        <div className='savings-wallet-container'>
            <h2>Savings Wallet</h2>
            <p className='savings-balance'>Savings Balance: {savingsBalance} ETH</p>

            <label className='withdraw-label'>
                Withdraw Amount (ETH):&nbsp;
                <input
                    className='withdraw-input'
                    type='text'
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                />
            </label>
            <button className='withdraw-button ' onClick={handleWithdraw}>
                Withdraw
            </button>
            <br></br>
            <button className='nft-button' onClick={handleGenerateNFT}>
                Generate My Friday NFT
            </button>

            <button className='update-balance-button' onClick={handleUpdateBalance}>
                Update Savings Balance
            </button>

            {withdrawSuccess && (
                <p className='success-message'>Withdrawal successful!</p>
            )}
            {withdrawError && <p className='error-message'>{withdrawError}</p>}
        </div>
    );
};

export default SavingsWallet;