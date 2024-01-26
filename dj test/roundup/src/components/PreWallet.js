import React, { useState } from 'react';
import {
  createWallet,
  importWalletFromPrivateKey,
  importWalletFromMnemonic,
} from '../interaction.js'; // Replace with the actual path to your wallet functions file
import WalletDetailsComponent from './WalletDetailsComponent'; // Import the updated WalletDetailsComponent
import { setCurrentWalletDetails } from './ExportFuncs';
import WalletActionsComponent from './WalletFunc';

const WalletComponent = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [walletDetails, setWalletDetails] = useState({
    address: '',
    privateKey: '',
  });

  const renderComponent = (component) => {
    setActiveComponent(component);
  };

  const [importOption, setImportOption] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [isImported, setIsImported] = useState(false);

  const handleCreateWallet = () => {
    const wallet = createWallet();
    console.log('New Wallet Created:');
    console.log('Address:', wallet.address);
    console.log('Private Key:', wallet.privateKey);

    // Display a popup with the mnemonic and private key
    alert(`New Wallet Created:
      Mnemonic: ${wallet.mnemonic.phrase}
      Private Key: ${wallet.privateKey}

      CAUTION: Store this information securely!`);

    setCurrentWalletDetails(wallet);
    // Update walletDetails state
    setWalletDetails({
      address: wallet.address,
      privateKey: wallet.privateKey,
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
    console.log('Wallet Imported from Private Key:');
    console.log('Address:', wallet.address);
    setCurrentWalletDetails(wallet);
    // Update walletDetails state
    setWalletDetails({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
    setIsImported(true);
    renderComponent(<WalletActionsComponent />);
  };

  const handleImportFromMnemonic = async () => {
    const wallet = importWalletFromMnemonic(mnemonic);
    console.log('Wallet Imported from Mnemonic:');
    console.log('Address:', wallet.address);
    setCurrentWalletDetails(wallet);
    // Update walletDetails state
    setWalletDetails({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
    setIsImported(true);
    renderComponent(<WalletActionsComponent />);
    
    // Clear the mnemonic input field
    setMnemonic('');
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
          <button onClick={() => setImportOption('mnemonic')}>Import from Mnemonic</button>
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

      {!isImported && importOption === 'mnemonic' && (
        <div>
          <input
            type="text"
            placeholder={'Enter Mnemonic Phrase'}
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
          />
          <button onClick={handleImportFromMnemonic}>Import</button>
        </div>
      )}
      {isImported && <WalletActionsComponent />}
    </div>
  );
};

export default WalletComponent;
