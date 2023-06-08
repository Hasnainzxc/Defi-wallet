import { h } from 'preact';
import { Router } from 'preact-router';
import { useState } from 'preact/hooks';
import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import Wallet from '../routes/wallet';

const App = () => {
  const [showWallets, setShowWallets] = useState(false);

  const toggleWallets = () => {
    setShowWallets(!showWallets);
  };
//here all the components render
  return (
    <div id="app">
      <Header toggleWallets={toggleWallets} />
      <main>
        <Router>
          <Home path="/" />
          <Profile path="/profile/" user="me" />
          <Profile path="/profile/:user" />
          {showWallets && <Wallet />}
        </Router>
      </main>
    </div>
  );
};

export default App;
