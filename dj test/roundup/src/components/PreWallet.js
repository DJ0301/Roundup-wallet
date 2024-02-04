import React, { useState, useEffect } from 'react';
import {
	createWallet,
	importWalletFromPrivateKey,
	getBalance,
} from '../interaction.js';
import WalletDetailsComponent from './WalletDetailsComponent';
import { setCurrentWalletDetails } from './ExportFuncs';
import WalletActionsComponent from './WalletFunc';
import { Tooltip, Button, Dropdown, Menu } from 'antd';
import './PreWallet.css';

const WalletComponent = () => {
	const [activeComponent, setActiveComponent] = useState(null);
	const [walletDetails, setWalletDetails] = useState({
		address: '',
		privateKey: '',
		balance: '',
	});
	const [isImported, setIsImported] = useState(false);
	const [importOption, setImportOption] = useState(null);
	const [privateKey, setPrivateKey] = useState('');
	const [isWalletCreated, setIsWalletCreated] = useState(false);
	const [currentNetwork, setCurrentNetwork] = useState(
		'Lightlink Pegasus Testnet',
	);

	useEffect(() => {
		const isLoggedIn = sessionStorage.getItem('isLoggedIn');
		if (isLoggedIn === 'true') {
			const wallet = JSON.parse(sessionStorage.getItem('walletDetails'));
			setCurrentWalletDetails(wallet);
			setWalletDetails({
				address: wallet.address,
				privateKey: wallet.privateKey,
				balance: wallet.balance,
			});
			setIsImported(true);
			setIsWalletCreated(true);
			setActiveComponent(<WalletActionsComponent />);
		}
	}, []);

	const renderComponent = (component) => {
		setActiveComponent(component);
	};

	const handleCreateWallet = () => {
		const wallet = createWallet();
		const balance = getBalance(wallet.address);
		setCurrentWalletDetails(wallet);
		setWalletDetails({
			address: wallet.address,
			privateKey: wallet.privateKey,
			balance: wallet.balance,
		});
		setIsImported(true);
		setIsWalletCreated(true);
		sessionStorage.setItem('isLoggedIn', 'true');
		sessionStorage.setItem('walletDetails', JSON.stringify(wallet));
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
			balance: wallet.balance,
		});
		setIsImported(true);
		setIsWalletCreated(true);
		sessionStorage.setItem('isLoggedIn', 'true');
		sessionStorage.setItem('walletDetails', JSON.stringify(wallet));
		renderComponent(<WalletActionsComponent />);
	};

	const handleLogout = () => {
		sessionStorage.removeItem('isLoggedIn');
		sessionStorage.removeItem('walletDetails');
		setIsImported(false);
		setIsWalletCreated(false);
		setImportOption(null);
		setPrivateKey('');
		setActiveComponent(null);
	};

	const copyPrivateKey = () => {
		navigator.clipboard.writeText(walletDetails.privateKey);
	};

	const menu = (
		<Menu>
			<Menu.Item key='1' onClick={copyPrivateKey}>
				Copy Private Key
			</Menu.Item>
			<Menu.Item key='2' onClick={handleLogout}>
				Logout
			</Menu.Item>
		</Menu>
	);

	return (
		<div className='wallet-container'>
			{!isImported && (
				<div className='wallet wallet-buttons'>
					<h1>गullaक</h1>
					<button onClick={handleCreateWallet}>Create Wallet</button>
					<button onClick={handleImportWallet}>Import Wallet</button>
				</div>
			)}

			{(isImported || isWalletCreated) && (
				<div className='network'>
					<div className='network dropdown-button'>{currentNetwork}</div>
				</div>
			)}
			<div className='dropdown-menu'>
				{(isImported || isWalletCreated) && (
					<Dropdown overlay={menu}>
						<Button
							className='dropdown-button'
							style={{
								padding: '0	8px 0 8px',
							}}
						>
							&#8942;
						</Button>
					</Dropdown>
				)}

				{!isImported && importOption === 'choose' && (
					<div className='wallet-buttons'>
						<button onClick={() => setImportOption('privateKey')}>
							Import from Private Key
						</button>
					</div>
				)}

				{!isImported && importOption === 'privateKey' && (
					<div className='wallet-buttons'>
						<input
							type='text'
							placeholder='Enter Private Key'
							value={privateKey}
							onChange={(e) => setPrivateKey(e.target.value)}
						/>
						<button onClick={handleImportFromPrivateKey}>Import</button>
					</div>
				)}

				{isImported && (
					<div>{activeComponent || <WalletActionsComponent />}</div>
				)}
			</div>
		</div>
	);
};

export default WalletComponent;