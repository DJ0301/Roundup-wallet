import React, { useState } from 'react';
import {
  createWallet,
  importWalletFromPrivateKey,
  getBalance,
} from '../interaction.js'; // Replace with the actual path to your wallet functions file
import WalletDetailsComponent from './WalletDetailsComponent'; // Import the updated WalletDetailsComponent
import { setCurrentWalletDetails } from './ExportFuncs';
import WalletActionsComponent from './WalletFunc';

const WalletComponent = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [walletDetails, setWalletDetails] = useState({
    address: '',
    privateKey: '',
    balance: ''
  });
  const [isImported, setIsImported] = useState(false);
  const [importOption, setImportOption] = useState(null);
  const [privateKey, setPrivateKey] = useState('');

  const renderComponent = (component) => {
    setActiveComponent(component);
  };

  const handleCreateWallet = () => {
    const wallet = createWallet();
    const balance = getBalance(wallet.address);

    alert(`New Wallet Created:
      Address: ${wallet.address}
      Private Key: ${wallet.privateKey}

      CAUTION: Store this information securely!`);

    setCurrentWalletDetails(wallet);
    setWalletDetails({
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance: wallet.balance
    });
    setIsImported(true);
    renderComponent(<WalletActionsComponent />);
  };

  const handleImportWallet = () => {
    setImportOption('choose');
    renderComponent(<WalletActionsComponent />);
  };

  const handleImportFromPrivateKey = async () => {
    const wallet = importWalletFromPrivateKey(privateKey);
    const balance = getBalance(wallet.address);

    setCurrentWalletDetails(wallet);
    setWalletDetails({
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance: wallet.balance
    });
    setIsImported(true);
    renderComponent(<WalletActionsComponent />);
  };

  return (
    <div>
      {!isImported && (
        <div>
          <button onClick={handleCreateWallet}>Create Wallet</button>
          <button onClick={handleImportWallet}>Import Wallet</button>
        </div>
      )}

      {!isImported && importOption === 'choose' && (
        <div>
          <button onClick={() => setImportOption('privateKey')}>Import from Private Key</button>
        </div>
      )}

      {!isImported && importOption === 'privateKey' && (
        <div>
          <input
            type="text"
            placeholder="Enter Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <button onClick={handleImportFromPrivateKey}>Import</button>
        </div>
      )}

      {isImported && (
        <div>
          <WalletActionsComponent />
        </div>
      )}
    </div>
  );
};

export default WalletComponent;
