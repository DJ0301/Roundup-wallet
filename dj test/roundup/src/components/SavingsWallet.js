import React, { useState, useEffect } from 'react';
import { withdrawETH, getBalance } from '../interaction.js'; // Import the withdrawETH and getSavingsBalance functions
import { wallet } from './ExportFuncs.js';
import { generateNFT } from '../nft.js'; // Import the generateNFT function

const SavingsWallet = () => {
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  useEffect(() => {
    async function fetchSavingsBalance() {
      try {
        const balance = await getBalance(); // Call the getSavingsBalance function from interaction.js
        setSavingsBalance(balance);
      } catch (error) {
        console.error('Error fetching savings balance:', error.message);
      }
    }
    fetchSavingsBalance();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
      setWithdrawError('Invalid withdraw amount.');
      return;
    }

    try {
      await withdrawETH(parseFloat(withdrawAmount)); // Call the withdrawETH function
      setWithdrawSuccess(true);
      setSavingsBalance(prevBalance => prevBalance - parseFloat(withdrawAmount));
    } catch (error) {
      setWithdrawError(`Error withdrawing from savings: ${error.message}`);
    }
  };

  const handleGenerateNFT = async () => {
    try {
      await generateNFT(); // Call the generateNFT function from nft.js
      console.log('Friday NFT generated successfully!');
    } catch (error) {
      console.error('Error generating Friday NFT:', error.message);
    }
  };

  return (
    <div>
      <h2>Savings Wallet</h2>
      <p>Savings Balance: {savingsBalance} ETH</p>

      <label>
        Withdraw Amount (ETH):
        <input
          type="text"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
      </label>
      <button onClick={handleWithdraw}>Withdraw</button>

      <button onClick={handleGenerateNFT}>Generate My Friday NFT</button>

      {withdrawSuccess && <p>Withdrawal successful!</p>}
      {withdrawError && <p>{withdrawError}</p>}
    </div>
  );
};

export default SavingsWallet;
