import { h } from 'preact';
import { Router } from 'preact-router';


import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';
import Wallet from '../routes/wallet';

// import ConnectWallet from './ConnectWallet';


const App = () => (
	<div id="app">
		<Header />
		<main>
			<Router>
				<Home path="/" />
				<Profile path="/profile/" user="me" />
				<Profile path="/profile/:user" />
				<Wallet path="/wallet" />
			</Router>
			
		</main>
	</div>
);

export default App;
