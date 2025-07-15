import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Heart } from 'lucide-react'; // Importing icons from lucide-react

import contractABI from "./abi.json";
import { contractAddress } from './constants'; // Import contract address from constants file
import { showMessageBox } from './utils'; // Import showMessageBox from utils file

function App() {
  const [accounts, setAccounts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [message, setMessage] = useState("Connect your wallet to get started");
  const [newThreadContent, setNewThreadContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Utility function to show custom modal messages (passed down to utils)
  const displayMessage = (msg) => {
    showMessageBox(msg, setModalMessage, setShowModal);
  };

  // Effect hook to connect to MetaMask and set up account change listener
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccounts([accs[0]]);
          setMessage("Wallet connected!");
        } catch (error) {
          setMessage("Error connecting to MetaMask. Please ensure MetaMask is installed and unlocked.");
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        setMessage("MetaMask not detected. Please install MetaMask to use this DApp.");
        console.error('MetaMask not detected');
      }
    };

    connectWallet();

    window.ethereum?.on('accountsChanged', (newAccounts) => {
      if (newAccounts.length > 0) {
        setAccounts([newAccounts[0]]);
        setMessage("Wallet account changed.");
        fetchThreads();
      } else {
        setAccounts([]);
        setMessage("Wallet disconnected. Connect your wallet to get started.");
        setThreads([]);
      }
    });

    return () => {
      window.ethereum?.removeListener('accountsChanged', () => {});
    };
  }, []);

  // Function to fetch all threads from the smart contract
  const fetchThreads = async () => {
    if (!accounts[0]) {
      displayMessage("Please connect your MetaMask wallet first.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const result = await contract.methods.getAllThreads(accounts[0]).call();
      console.log("Fetched Threads:", result);

      const formattedThreads = result.map(thread => ({
        id: thread.id,
        author: thread.author,
        content: thread.content,
        timestamp: new Date(Number(thread.timestamp) * 1000).toLocaleString(),
        upvotes: Number(thread.upvotes)
      })).reverse();

      setThreads(formattedThreads);
      setMessage("Threads loaded successfully!");
    } catch (error) {
      console.error('Error getting threads:', error);
      displayMessage(`Error fetching threads: ${error.message || error}`);
    }
  };

  // Function to create a new thread (tweet)
  const createNewThread = async () => {
    if (!accounts[0]) {
      displayMessage("Please connect your MetaMask wallet first.");
      return;
    }
    if (!newThreadContent.trim()) {
      displayMessage("Thread content cannot be empty.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      await contract.methods.createTweet(newThreadContent).send({ from: accounts[0] });

      displayMessage("Thread created successfully!");
      setNewThreadContent('');
      fetchThreads();
    } catch (error) {
      console.error('Error creating thread:', error);
      displayMessage(`Error creating thread: ${error.message || error}`);
    }
  };

  // Function to like a thread
  const likeThread = async (author, id) => {
    if (!accounts[0]) {
      displayMessage("Please connect your MetaMask wallet first.");
      return;
    }
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods.likeTweet(author, id).send({ from: accounts[0] });
      displayMessage("Thread liked!");
      fetchThreads();
    } catch (error) {
      console.error('Error liking thread:', error);
      displayMessage(`Error liking thread: ${error.message || error}`);
    }
  };

  // Function to unlike a thread
  const unlikeThread = async (author, id) => {
    if (!accounts[0]) {
      displayMessage("Please connect your MetaMask wallet first.");
      return;
    }
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods.unlikeTweet(author, id).send({ from: accounts[0] });
      displayMessage("Thread unliked!");
      fetchThreads();
    } catch (error) {
      console.error('Error unliking thread:', error);
      displayMessage(`Error unliking thread: ${error.message || error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white font-inter p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      {/* Custom Modal for messages */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 sm:p-8 shadow-2xl border border-purple-700 max-w-sm w-full text-center">
            <p className="text-lg mb-6 text-gray-200">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="container max-w-3xl w-full bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 my-8 border border-indigo-700">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Placeholder for Threads Clone Logo */}
          <img
            id="header-img-1"
            src="https://placehold.co/120x120/8B5CF6/FFFFFF?text=THREADS"
            alt="Threads Clone Logo"
            className="rounded-full w-24 h-24 sm:w-32 sm:h-32 object-cover border-4 border-purple-500 shadow-lg mb-4"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            THREADS
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-300 font-medium tracking-wide">
            Decentralized Social Media
          </h2>
          <p className="text-md text-gray-400 mt-4">{message}</p>
        </div>

        {/* Wallet Connection / Account Info Section */}
        {accounts[0] ? (
          <div className="text-center mb-8">
            <p className="text-lg text-green-400 mb-4 p-3 bg-gray-700 rounded-lg shadow-inner">
              Connected account: <span className="font-mono break-all">{accounts[0].slice(0, 6)}...{accounts[0].slice(-4)}</span>
            </p>
            <button
              onClick={fetchThreads}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Refresh Threads
            </button>
          </div>
        ) : (
          <div className="text-center mb-8">
            <button
              onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl font-bold text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Connect MetaMask Wallet
            </button>
          </div>
        )}

        {/* Create New Thread Section */}
        {accounts[0] && (
          <div className="mb-8 p-6 bg-gray-700 rounded-xl shadow-inner border border-gray-600">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Create New Thread</h2>
            <textarea
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-y min-h-[80px]"
              placeholder="What's on your mind?"
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              rows="4"
            ></textarea>
            <button
              onClick={createNewThread}
              className="mt-4 w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Post Thread
            </button>
          </div>
        )}

        {/* Threads Display Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">Recent Threads</h2>
          {threads.length > 0 ? (
            <div className="space-y-6">
              {threads.map((thread) => (
                <div key={thread.id} className="thread-box bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-600 hover:border-purple-500 transition duration-200 ease-in-out">
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="font-semibold text-purple-300">Author:</span> {thread.author.slice(0, 6)}...{thread.author.slice(-4)}
                  </p>
                  <p className="text-gray-100 text-lg mb-4 leading-relaxed break-words">{thread.content}</p>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1 text-red-400" /> {thread.upvotes} Likes
                    </span>
                    <span>{thread.timestamp}</span>
                  </div>
                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={() => likeThread(thread.author, thread.id)}
                      className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-white text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
                    >
                      <Heart className="w-4 h-4 mr-1" /> Like
                    </button>
                    <button
                      onClick={() => unlikeThread(thread.author, thread.id)}
                      className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-full text-white text-sm font-medium transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
                    >
                      <Heart className="w-4 h-4 mr-1" /> Unlike
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg">No threads found. Be the first to post!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
