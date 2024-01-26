import React, { useState } from 'react';
import { sendETH, receiveETH, savingsMode, getCurrentNetwork } from '../interaction.js';
import { wallet } from './ExportFuncs.js';
import QRCode from 'qrcode.react';

const WalletActionsComponent = () => {
  const [amountToSend, setAmountToSend] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isSendClicked, setIsSendClicked] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [errorPopup, setErrorPopup] = useState('');
  const [currentView, setCurrentView] = useState('main');

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

  const handleReceiveETH = () => {
    setShowQRCode(true);
    receiveETH(wallet);
    setCurrentView('main');
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

  return (
    <div>
      <div>
        <p>Current Wallet Address: <b>{wallet.address}</b></p>
        <p>Current Network: <b>Lightlink Pegasus Testnet</b></p>
      </div>

      {currentView === 'main' && (
        <div>
          <button onClick={handleSendClick}>Send</button>
          <button onClick={handleReceiveClick}>Receive ETH</button>
          <label>
            Savings Mode:
            <input
              type="checkbox"
              onChange={savingsMode}
            />
          </label>
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
    </div>
  );
};

export default WalletActionsComponent;
