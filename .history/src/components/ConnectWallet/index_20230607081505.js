import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Web3 from 'web3';
import { PolygonDarkblockWidget } from "@darkblock.io/matic-widget";


const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');
  const [nfts, setNFTs] = useState([]);
  const [signature, setSignature] = useState('');
  const [authenticated, setAuthenticated] = useState(false);


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
      const selectedAccount = accounts[0].toLowerCase(); // Convert the account to lowercase

      setAccount(selectedAccount);

      const selectedChainId = await web3.eth.getChainId();
      setChainId(selectedChainId);

      const selectedBalance = await web3.eth.getBalance(selectedAccount);
      setBalance(selectedBalance);

      setConnected(true);

      const fetchNFTs = async (account) => {
        try {
          const response = await fetch(`https://api.darkblock.io/platform/matic/nft/0x62996f945e06ddaf1F22202B7D3911Ac02A6786E/${account}`);
          const data = await response.json();
          setNFTs(data);
        } catch (error) {
          console.error('Error fetching NFTs', error);
          setNFTs([]);
        }
      };

      await fetchNFTs(selectedAccount);

      console.log(`Connected to ${network} wallet`);
    } catch (error) {
      console.error('Error connecting to wallet', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_disconnect' });
      } else if (typeof window.solana !== 'undefined') {
        await window.solana.disconnect();
      }

      setConnected(false);
      setAccount('');
      setBalance('0');
      setChainId('');
      setNFTs([]);
      setSignature('');

      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet', error);
    }
  };
  const handleAuthentication = () => {
    console.log('Authenticated as the owner');
    setAuthenticated(true);
  };
  

  const verifySignature = async () => {
    try {
      if (!window.ethereum) {
        console.log('MetaMask not detected');
        return;
      }

      const web3 = new Web3(window.ethereum);
      const message = 'Verification Message'; // Customize the message to be verified

      const signedMessage = await web3.eth.personal.sign(
        message,
        account,
        ''
      );

      setSignature(signedMessage);

      // TODO: Send the signed message to the server for verification
    } catch (error) {
      console.error('Error verifying signature', error);
    }
  };
  


  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window.ethereum !== 'undefined') {
        connectToWallet('ethereum');
      }
    };

    checkMetaMask();
  }, []);

  return (
    <div>
      {connected ? (
        <div>
          <p>Connected to {chainId}</p>
          <p>Account: {account}</p>
          <p>Balance: {balance}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
          <button onClick={verifySignature}>Verify Signature</button>
          {signature && <p>Signature: {signature}</p>}
        </div>
      ) : (
        <div>
          <button onClick={() => connectToWallet('ethereum')}>Connect to Ethereum</button>
          <button onClick={() => connectToWallet('polygon')}>Connect to Polygon</button>
          <button onClick={() => connectToWallet('solana')}>Connect to Solana</button>
        </div>
      )}

      {nfts.length > 0 && (
        <div>
          <h2>Your NFTs</h2>
          <ul>
            {nfts.map((nft) => (
              <li key={nft.tokenId}>{nft.name}</li>
            ))}
          </ul>
        </div>
      )}
      

      {connected && (
        <PolygonDarkblockWidget
          contractAddress="0x62996f945e06ddaf1f22202b7d3911ac02a6786e" // Replace with your contract address
          tokenId="1" // Replace with your token ID
          w3={Web3}
          cb={(param) => console.log(param)}
          config={{
            customCssClass: "",
            debug: false,
            imgViewer: {
              showRotationControl: true,
              autoHideControls: true,
              controlsFadeDelay: true,
            },
          }}
        />
      )}
     
    

    </div>
  );
};

export default ConnectWallet;
