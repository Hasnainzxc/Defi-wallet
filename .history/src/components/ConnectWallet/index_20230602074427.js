import { h } from 'preact';
import { FiLink } from 'react-icons/fi';

const ConnectWallet = () => {
  return (
    <div class="flex justify-center items-center h-screen">
      <div class="p-8 bg-gray-100 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold mb-4">Crypto Wallet</h1>
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
      </div>
    </div>
  );
};

export default ConnectWallet;
