import { h } from 'preact';
import style from './style.css';
import ConnectWallet from '../../components/ConnectWallet';

const Wallet = () => {
	return (
		<div class={style.home}>
			
			
			<section>
				<ConnectWallet />
			</section>
		</div>
	);
};



export default Wallet;
