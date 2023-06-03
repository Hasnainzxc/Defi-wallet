import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { FiLink } from 'react-icons/fi';
import Web3 from 'web3';

const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');
  const [nfts, setNFTs] = useState ([]);

  const connectToWallet = async (wallet) => {
    try {
      let provider;
      let chainId;
      let network;
      

      switch (wallet) {
        case 'ethereum':
          // Check if MetaMask is installed
          if (typeof window.ethereum !== 'undefined') {
            // Request access to the user's MetaMask account
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Get the current chain ID
            chainId = await window.ethereum.request({ method: 'eth_chainId' });

            provider = window.ethereum;
            network = 'Ethereum';
          } else {
            // MetaMask not detected
            console.log('MetaMask not detected');
            return;
          }
          break;

        case 'polygon':
          // Check if MetaMask is installed
          if (typeof window.ethereum !== 'undefined') {
            // Request access to the user's MetaMask account
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Switch to the Polygon network (Chain ID 137)
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }],
            });

            // Get the current chain ID
            chainId = await window.ethereum.request({ method: 'eth_chainId' });

            provider = window.ethereum;
            network = 'Polygon';
          } else {
            // MetaMask not detected
            console.log('MetaMask not detected');
            return;
          }
          break;

        case 'solana':
          // Connect to Solana wallet using the Solana Web3 library
          // Implement the connection to Solana wallet according to the library you are using
          // For example, using @solana/web3.js library
          // const connection = new web3.Connection('https://api.mainnet-beta.solana.com');
          // const wallet = new web3.Wallet(provider);
          // ...
          // Set the necessary values for Solana wallet connection
          // chainId = ...;
          // provider = ...;
          // network = 'Solana';
          // ...
          break;

        default:
          console.log('Invalid wallet selection');
          return;
      }

      // Create a Web3 instance using the selected provider
      const web3 = new Web3(provider);

      // Get the user's account address
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      setAccount(account);

      // Get the user's account balance
      const balance = await web3.eth.getBalance(account);
      setBalance(balance);

      setConnected(true);
      setChainId(chainId);

      const nfts = await fetchNFTs(web3, account);
        setNFTs(nfts);

      console.log(`Connected to ${network} wallet`);
    } catch (error) {
      console.error('Error connecting to wallet', error);
    }
  };

  return (
    <div class="flex justify-center items-center h-screen">
      <div class="p-8 bg-gray-100 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold mb-4">Crypto Wallet</h1>
        {connected ? (
          <div>
            <p>Connected Account: {account}</p>
            <p>Chain ID: {chainId}</p>
            <p>Account Balance: {balance}</p>
            <p>nfts: {nfts}</p>
          </div>
        ) : (
          <div class="flex flex-col gap-4">
            <button
              class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => connectToWallet('polygon')}
            >
              <FiLink />
              Connect to Polygon
            </button>
            <button
              class="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg"
              onClick={() => connectToWallet('ethereum')}
            >
              <FiLink />
              Connect to Ethereum
            </button>
            <button
              class="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => connectToWallet('solana')}
            >
              <FiLink />
              Connect to Solana
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
