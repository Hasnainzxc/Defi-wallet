import { h } from 'preact';
import style from './style.css';
import ConnectWallet from '../../components/ConnectWallet';

const wallet = () => {
	return (
		<div class={style.home}>
			
			<h1>Get Started Building PWAs with Preact-CLI</h1>
			<section>
				<ConnectWallet></ConnectWallet>
			</section>
		</div>
	);
};



export default wallet;
