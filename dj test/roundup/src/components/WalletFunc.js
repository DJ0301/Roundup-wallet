import React, { useState, useEffect } from 'react';
import { sendETH, savingsMode, getBalance } from '../interaction.js';
import { wallet } from './ExportFuncs.js';
import QRCode from 'qrcode.react';
import SavingsWallet from './SavingsWallet.js';
import './WalletFunc.css';

const WalletActionsComponent = () => {
	const [amountToSend, setAmountToSend] = useState('');
	const [recipientAddress, setRecipientAddress] = useState('');
	const [isSendClicked, setIsSendClicked] = useState(false);
	const [showQRCode, setShowQRCode] = useState(false);
	const [errorPopup, setErrorPopup] = useState('');
	const [currentView, setCurrentView] = useState('main');
	const [balance, setBalance] = useState(0);
	const [isSavingsModeOn, setIsSavingsModeOn] = useState(false);

	useEffect(() => {
		const fetchBalance = async () => {
			try {
				const balance = await getBalance(wallet.address);
				setBalance(balance);
			} catch (error) {
				console.error('Error fetching balance:', error);
				setErrorPopup('Error fetching balance');
			}
		};
		fetchBalance();
	}, [wallet.address]);

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
		savingsMode();
		setIsSavingsModeOn(e.target.checked);
	};

	const handleViewNFT = () => {
		window.open(
			`https://pegasus.lightlink.io/address/${wallet.address}`,
			'_blank',
		);
	};

	const updateBalance = async () => {
		try {
			const updatedBalance = await getBalance(wallet.address);
			setBalance(updatedBalance);
		} catch (error) {
			console.error('Error updating balance:', error);
			setErrorPopup('Error updating balance');
		}
	};

	return (
		<div className='wallet-actions-container'>
			<div className='wallet-info'>
				<p>
					Current Wallet Address: <b>{wallet.address}</b>
				</p>
				<p>
					Current Network: <b>Lightlink Pegasus Testnet</b>
				</p>
				<p>
					Current Balance: <b>{balance} ETH</b>
				</p>
			</div>

			{currentView === 'main' && (
				<div className='wallet-buttons'>
					<button onClick={handleSendClick}>Send</button>
					<button onClick={handleReceiveClick}>Receive ETH</button>
					<br />
					<br />
					<div style={{ textAlign: 'center' }}>
						<button onClick={handleViewNFT}>View my NFTs</button>
						<button onClick={updateBalance}>Update Balance</button>
						<br />
						<br />
						<label className='savings-mode-label'>
							Savings Mode:
							<input type='checkbox' onChange={handleSavingsMode} />
						</label>
					</div>
				</div>
			)}

			{currentView === 'send' && (
				<div className='wallet-buttons'>
					<label>
						Amount to Send (ETH):
						<input
							type='text'
							value={amountToSend}
							onChange={(e) => setAmountToSend(e.target.value)}
						/>
					</label>
					<br />
					<br />
					<label>
						Recipient Address:
						<br></br><br></br>
						<input
							type='text'
							value={recipientAddress}
							onChange={(e) => setRecipientAddress(e.target.value)}
						/>
					</label>
					<br />
					<br />
					<button onClick={handleSendETH} className='wallet-buttons'>Send ETH</button>
					<br />
					<br />
				</div>
			)}

			{currentView === 'receive' && (
				<div>
					<p>Scan the QR code to receive ETH:</p>
					<QRCode value={wallet.address} />
				</div>
			)}

			{errorPopup && (
				<div className='popup'>
					<p>{errorPopup}</p>
					<button onClick={() => setErrorPopup('')}>Close</button>
				</div>
			)}

			{currentView !== 'main' && (
				<div className='wallet-buttons'>
				<button onClick={handleBackButtonClick} >Back</button>
				</div>
			)}

			{isSavingsModeOn && <SavingsWallet />}
		</div>
	);
};

export default WalletActionsComponent;