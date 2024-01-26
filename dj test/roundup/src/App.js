import React from 'react';
import './App.css';
import WalletComponent from './components/PreWallet';
// import WalletActionsComponent from './components/WalletFunc';
import SavingsWallet from './components/SavingsWallet';
function App() {
  return (
    <div className="App">
      <SavingsWallet/>
    </div>
  );
}

export default App;
