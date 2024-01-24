import React, { useState, useEffect } from 'react';
import { createWallet, importWalletFromPrivateKey, importWalletFromMnemonic, getBalance, sendETH, ethToUSD, roundUpTo10s, sendRoundedAmount, receiveETH, displayCurrentAddress, savingsMode } from './interaction.js'; 
function App() {
  const [wallet, setWallet] = useState(null);
  const [importedWallet, setImportedWallet] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (wallet) {
      getBalance(wallet.address).then(setBalance);
    }
  }, [wallet]);

  const handleCreateWallet = () => {
    const newWallet = createWallet();
    setWallet(newWallet);
  };

  const handleImportWallet = (privateKey) => {
    const importedWallet = importWalletFromPrivateKey(privateKey);
    setImportedWallet(importedWallet);
  };

  const handleSendETH = async () => {
    if (wallet && importedWallet) {
      const receiverAddress = '0x1234567890123456789012345678901234567890';
      const amountToSend = '0.05';
      await sendETH(wallet, receiverAddress, amountToSend);
    }
  };

  const handleEthToUSD = async () => {
    if (wallet) {
      const amountInETH = '0.1';
      await ethToUSD(amountInETH);
    }
  };

  const handleRoundUpTo10s = () => {
    if (wallet) {
      const amountInUSD = 15.75; // Replace with actual amount
      roundUpTo10s(amountInUSD);
    }
  };

  const handleSendRoundedAmount = async () => {
    if (wallet) {
      const roundedAmount = 15.75; // Replace with actual amount
      await sendRoundedAmount(wallet, roundedAmount);
    }
  };

  const handleReceiveETH = () => {
    if (wallet) {
      receiveETH(wallet);
    }
  };

  const handleDisplayAddress = () => {
    if (wallet) {
      displayCurrentAddress(wallet);
    }
  };

  const handleSavingsMode = async () => {
    if (wallet) {
      await savingsMode(wallet);
    }
  };

  return (
    <div className="App">
      <h1>Ethereum Interface</h1>

      <button onClick={handleCreateWallet}>Create Wallet</button>

      {wallet && (
        <>
          <h2>Wallet Info</h2>
          <p>Address: {wallet.address}</p>
          <p>Private Key: {wallet.privateKey}</p>
          <p>Balance: {balance} ETH</p>

          <button onClick={() => handleImportWallet('0x0123456789012345678901234567890123456789012345678901234567890123')}>
            Import Wallet
          </button>

          {importedWallet && (
            <>
              <h2>Imported Wallet Info</h2>
              <p>Address: {importedWallet.address}</p>
            </>
          )}

          <button onClick={handleSendETH}>Send ETH</button>
          <button onClick={handleEthToUSD}>ETH to USD</button>
          <button onClick={handleRoundUpTo10s}>Round Up to 10s</button>
          <button onClick={handleSendRoundedAmount}>Send Rounded Amount</button>
          <button onClick={handleReceiveETH}>Receive ETH</button>
          <button onClick={handleDisplayAddress}>Display Address</button>
          <button onClick={handleSavingsMode}>Savings Mode</button>
        </>
      )}
    </div>
  );
}

export default App;
