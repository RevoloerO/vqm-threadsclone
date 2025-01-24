import { useState } from 'react'
import axios from 'axios'
import Web3 from 'web3'
import { useEffect } from 'react';
import './App.css'
import contractABI from "./abi.json";

import headerImg1 from './assets/threads-clone-logo.jpeg';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [threads, setThreads] = useState([]);

  const ShowThreads = () => {
    const web3 = new Web3(window.ethereum);
    const contractAddress = '0x9b6b1b1e8d9e1c0f6d7b4f4e2d0c1f4e1f7f2e1c';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    contract.methods.getAllThreads(accounts[0]).call()
      .then((result) => {
        console.log('Threads:', result);
      })
      .catch((error) => {
        console.error('Error getting threads:', error);
      });

    return (
      <div>
        <h2>Threads</h2>
        {}
      </div>
    )
  }

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum
          .request({ method: 'eth_requestAccounts' });
          setAccount([accounts[0]]);
        } catch (error) {
          getElementById('message').innerHTML = 'Error connecting to MetaMask';
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        getElementById('message').innerHTML = 'MetaMask not detected';
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
              <p id='message'>Connect your wallet to get started</p>
              {accounts[0] ? (
                <p>Connected account: {accounts[0].slice(0, 5)}...{accounts[0].slice(-4)}</p>
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
