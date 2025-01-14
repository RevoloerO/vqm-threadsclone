import { useState } from 'react'
import axios from 'axios'
import Web3 from 'web3'
import { useEffect } from 'react';
import './App.css'
import contractABI from "./abi.json";

import headerImg1 from './assets/threads-clone-logo.jpeg';

function App() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('MetaMask not detected');
      }
    };

    connectWallet();
  }, []);

  return (
    <>
      <div className='container'>
              <img id="header-img-1" src={headerImg1} alt=""></img>
              <h1>THREADS</h1>
              <h2>Decentralized Social Media</h2>
              <p>Connect your wallet to get started</p>
              {account ? (
                <p>Connected account: {account}</p>
              ) : (
                <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
                  Connect MetaMask
                </button>
              )}
            </div>
    </>
  );
}

export default App
