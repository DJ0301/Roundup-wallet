import React, { useEffect, useState } from 'react';
import { getBalance } from '../interaction.js'; // Replace with the actual path to your wallet functions file

const WalletDetailsComponent = ({ address, privateKey }) => {
  const [balance, setBalance] = useState(null);
  
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletBalance = await getBalance(address);
        setBalance(walletBalance);
      } catch (error) {
        console.error('Error fetching balance:', error.message);
      }
    };

    if (address) {
      fetchBalance();
    }
  }, [address]);

  return (
    <div>
      <p>Wallet Address: {address}</p>
      <p>Wallet Balance: {balance !== null ? `${balance} ETH` : 'Loading...'}</p>
    </div>
  );
};

export default WalletDetailsComponent;
