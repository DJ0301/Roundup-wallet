import React, { useState, useEffect } from 'react';
import { sendETH, savingsMode, getBalance } from '../interaction.js';
import { wallet } from './ExportFuncs.js';
import QRCode from 'qrcode.react';
import SavingsWallet from './SavingsWallet.js'; // Import the component to display when savings mode is on
import './WalletFunc.css'
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
    window.open(`https://pegasus.lightlink.io/address/${wallet.address}`, '_blank');
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
      <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    /> 
      <div>
        <p>Current Wallet Address: <b>{wallet.address}</b></p>
        <p>Current Network: <b>Lightlink Pegasus Testnet</b></p>
        <p>Current Balance: <b>{balance} ETH</b></p> {/* Display the balance */}
      </div>
      {currentView === 'main' && (
        <div>
          <button onClick={handleSendClick}>Send</button>
          <button onClick={handleReceiveClick}>Receive ETH</button>
          <br></br>
          <br></br>
          <div style={{ textAlign: 'center' }}>
          <button onClick={handleViewNFT}>View my NFTs</button>
        <button onClick={updateBalance}>Update Balance</button>
        <br></br>
          <br></br>
          <div className='svng'>
          <label className='btn'>
            Savings Mode: 
            </label>
            <input
              type="checkbox"
              onChange={handleSavingsMode}
              className="check"
            />
          </div>
      </div>
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
          <br></br>
          <br></br>
          <label>
            Recipient Address:
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </label>
          <br></br>
          <br></br>
          <button onClick={handleSendETH}>Send ETH</button>
          <br></br>
          <br></br>
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
    
      {isSavingsModeOn && <SavingsWallet />} {/* Display SavingsWallet only if savings mode is on */}
    </div>
  );
};

export default WalletActionsComponent;
