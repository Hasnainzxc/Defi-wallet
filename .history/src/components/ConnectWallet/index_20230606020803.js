import { h } from 'preact';
import { useState } from 'preact/hooks';
import { FiLink } from 'react-icons/fi';
import Web3 from 'web3';

const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');
  const [nfts, setNFTs] = useState([]);

  const connectToWallet = async (wallet) => {
    try {
      let provider;
      let network;

      switch (wallet) {
        case 'ethereum':
          if (typeof window.ethereum !== 'undefined') {
            provider = window.ethereum;
            network = 'Ethereum';
          } else {
            console.log('MetaMask not detected');
            return;
          }
          break;

        case 'polygon':
          if (typeof window.ethereum !== 'undefined') {
            provider = window.ethereum;
            network = 'Polygon';
          } else {
            console.log('MetaMask not detected');
            return;
          }
          break;

        case 'solana':
          if (typeof window.solana !== 'undefined') {
            provider = window.solana;
            network = 'Solana';
          } else {
            console.log('Solana wallet not detected');
            return;
          }
          break;

        default:
          console.log('Invalid wallet selection');
          return;
      }

      await provider.request({ method: 'eth_requestAccounts' });

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      const selectedAccount = accounts[0];
      setAccount(selectedAccount);

      const selectedChainId = await web3.eth.getChainId();
      setChainId(selectedChainId);

      const selectedBalance = await web3.eth.getBalance(selectedAccount);
      setBalance(selectedBalance);

      setConnected(true);

      const fetchNFTs = async (web3, account) => {
        try {
          const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${account}`);
          const data = await response.json();
          setNFTs(data.assets); // Set the fetched NFTs to the state
        } catch (error) {
          console.error('Error fetching NFTs', error);
          setNFTs([]); // Set an empty array in case of an error
        }
      };

      await fetchNFTs(web3, selectedAccount);

      console.log(`Connected to ${network} wallet`);
    } catch (error) {
      console.error('Error connecting to wallet', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_logout' });
      } else if (typeof window.solana !== 'undefined') {
        await window.solana.disconnect();
      }

      setConnected(false);
      setAccount('');
      setBalance('0');
      setChainId('');
      setNFTs([]);

      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet', error);
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
            <p>NFTs: {nfts.length}</p> {/* Render the length of fetched NFTs */}
            <button
              class="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </button>
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
