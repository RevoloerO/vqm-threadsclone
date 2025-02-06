import { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import contractABI from "./abi.json";
import headerImg1 from './assets/threads-clone-logo.jpeg';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [message, setMessage] = useState("Connect your wallet to get started");

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccounts([accs[0]]);
        } catch (error) {
          setMessage("Error connecting to MetaMask");
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        setMessage("MetaMask not detected");
        console.error('MetaMask not detected');
      }
    };

    connectWallet();

    // Detect account changes
    window.ethereum?.on('accountsChanged', (newAccounts) => {
      setAccounts([newAccounts[0]]);
    });

  }, []);

  const ShowThreads = async () => {
    if (!accounts[0]) return;

    const web3 = new Web3(window.ethereum);
    const contractAddress = '0xE09a385eB59EE825C25BE0cB563828ABbdC07708'; // Replace with actual contract address
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
      console.log(contract);
      console.log(contract.methods);
      const result = await contract.methods.getAllThreads(accounts[0]).call();
      console.log("Fetched Threads:", result); // Debugging output
      setThreads(result);
    } catch (error) {
      console.error('Error getting threads:', error);
    }
  };

  return (
    <div className='container'>
      <img id="header-img-1" src={headerImg1} alt="Threads Clone Logo" />
      <h1>THREADS</h1>
      <h2>Decentralized Social Media</h2>
      <p>{message}</p>

      {accounts[0] ? (
        <>
          <p>Connected account: {accounts[0].slice(0, 5)}...{accounts[0].slice(-4)}</p>
          <button onClick={ShowThreads}>Fetch Threads</button>
          <div>
            <h2>Threads</h2>
            {threads.length > 0 ? (
              threads.map((thread, index) => (
                <div key={index} className="thread-box">
                  <p><strong>Thread {index + 1}:</strong> {thread}</p>
                </div>
              ))
            ) : (
              <p>No threads found.</p>
            )}
          </div>
        </>
      ) : (
        <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
          Connect MetaMask
        </button>
      )}
    </div>
  );
}

export default App;
