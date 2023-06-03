import { h } from 'preact';
import style from './style.css';
import ConnectWallet from '../../components/ConnectWallet';

const Wallet = () => {
	return (
		<div class={style.home}>
			
			<h1>Get Started Building PWAs with Preact-CLI</h1>
			<section>
				<ConnectWallet />
			</section>
		</div>
	);
};



export default Wallet;
