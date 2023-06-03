import { h } from 'preact';
import { useState } from 'preact/hooks';
import style from './style.css';
import ConnectWallet from '../../components/ConnectWallet';

const Wallet = () => {
  const [showWallets, setShowWallets] = useState(false);

  const toggleWallets = () => {
    setShowWallets(!showWallets);
  };

  return (
    <div class={style.home}>
      <section>
        <button class={style.walletButton} onClick={toggleWallets}>
          Wallet
        </button>
        {showWallets && (
          <div class={style.walletGrid}>
            <ConnectWallet />
          </div>
        )}
      </section>
    </div>
  );
};

export default Wallet;
