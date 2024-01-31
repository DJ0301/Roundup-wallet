import React, { useState, useEffect } from 'react';
import { sendETH, savingsMode, getBalance } from '../interaction.js';
import { wallet } from './ExportFuncs.js';
import QRCode from 'qrcode.react';
import SavingsWallet from './SavingsWallet.js'; // Import the component to display when savings mode is on

const WalletActionsComponent = () => {
  const [amountToSend, setAmountToSend] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isSendClicked, setIsSendClicked] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [errorPopup, setErrorPopup] = useState('');
  const [currentView, setCurrentView] = useState('main');
  const [balance, setBalance] = useState(0); // Initialize balance state with 0
  const [isSavingsModeOn, setIsSavingsModeOn] = useState(false); // Initialize savings mode state

  // Use useEffect to update balance when wallet address changes
  useEffect(() => {
    // Fetch the balance using the wallet address
    const fetchBalance = async () => {
      const balance = await getBalance(wallet.address);
      setBalance(balance);
      console.log(balance);
    };

    fetchBalance(); // Call the fetchBalance function when wallet address changes
  }, [wallet.address]); // Trigger useEffect when wallet address changes

  const handleSendETH = async () => {
    if (!amountToSend || isNaN(amountToSend) || !recipientAddress) {
      setErrorPopup('Invalid amount or recipient address.');
      return;
    }

    try {
      await sendETH(wallet, recipientAddress, amountToSend);
      console.log('ETH Sent Successfully');
      setCurrentView('main');
    } catch (error) {
      setErrorPopup(`Error sending ETH: ${error.message}`);
    }
  };

  const handleSendClick = () => {
    setIsSendClicked(true);
    setCurrentView('send');
  };

  const handleReceiveClick = () => {
    setShowQRCode(true);
    setCurrentView('receive');
  };

  const handleBackButtonClick = () => {
    setIsSendClicked(false);
    setShowQRCode(false);
    setErrorPopup('');
    setCurrentView('main');
  };

  const handleSavingsMode = (e) => {
    savingsMode(); // Call the savingsMode function
    setIsSavingsModeOn(e.target.checked); // Toggle savings mode state based on checkbox value
  };

  const handleViewNFT = () => {
    window.location.href = 'https://testnets.opensea.io/assets/goerli/0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8';
  };

  const updateBalance = async () => {
    try {
      const updatedBalance = await getBalance(wallet.address);
      setBalance(updatedBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div>
      <div>
        <p>Current Wallet Address: <b>{wallet.address}</b></p>
        <p>Current Network: <b>Lightlink Pegasus Testnet</b></p>
        <p>Current Balance: <b>{balance} ETH</b></p> {/* Display the balance */}
      </div>
      {currentView === 'main' && (
        <div>
          <button onClick={handleSendClick}>Send</button>
          <button onClick={handleReceiveClick}>Receive ETH</button>
          <label>
            Savings Mode:
            <input
              type="checkbox"
              onChange={handleSavingsMode}
            />
          </label>
          <button onClick={handleViewNFT}>View my NFTs</button>
        </div>
      )}

      {currentView === 'send' && (
        <div>
          <label>
            Amount to Send (ETH):
            <input
              type="text"
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
            />
          </label>
          <label>
            Recipient Address:
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </label>
          <button onClick={handleSendETH}>Send ETH</button>
        </div>
      )}

      {currentView === 'receive' && (
        <div>
          <p>Scan the QR code to receive ETH:</p>
          <QRCode value={wallet.address} />
        </div>
      )}

      {errorPopup && (
        <div className="popup">
          <p>{errorPopup}</p>
          <button onClick={() => setErrorPopup('')}>Close</button>
        </div>
      )}

      {currentView !== 'main' && (
        <button onClick={handleBackButtonClick}>Back</button>
      )}
    <div style={{ textAlign: 'center' }}>
        <button onClick={updateBalance}>Update Balance</button>
      </div>
      {isSavingsModeOn && <SavingsWallet />} {/* Display SavingsWallet only if savings mode is on */}
    </div>
  );
};

export default WalletActionsComponent;
