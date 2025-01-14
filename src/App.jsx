import { useState } from 'react'
import axios from 'axios'
import Web3 from 'web3'
import { useEffect } from 'react';
import './App.css'
import contractABI from "./abi.json";

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
    <div>
      <h1>Connect Wallet</h1>
      {account ? (
        <p>Connected account: {account}</p>
      ) : (
        <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
          Connect MetaMask
        </button>
      )}
    </div>
  );
}

export default App
