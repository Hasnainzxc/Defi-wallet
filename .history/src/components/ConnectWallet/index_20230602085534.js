
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { FiLink } from 'react-icons/fi';
import Web3 from 'web3';

// Rest of the component code...


const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request access to the user's MetaMask account
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);

        // Create a Web3 instance using the MetaMask provider
        const web3 = new Web3(window.ethereum);

        // Get the user's account address
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setAccount(account);

        // Get the user's account balance
        const balance = await web3.eth.getBalance(account);
        setBalance(balance);

        setConnected(true);
      } else {
        // MetaMask not detected
        console.log('MetaMask not detected');
      }
    } catch (error) {
      // Error connecting to MetaMask
      console.error('Error connecting to MetaMask', error);
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
          </div>
        ) : (
          <div class="flex flex-col gap-4">
            <button class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
              <FiLink />
              Connect to Polygon
            </button>
            <button class="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg">
              <FiLink />
              Connect to Ethereum
            </button>
            <button class="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg">
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
