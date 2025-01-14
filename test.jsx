import React, { useState } from 'react';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [connected, setConnected] = useState(false);

  const shortAddress = (address, startLength = 6, endLength = 4) => {
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  };

  const likeTweet = async (author, id) => {
    try {
      // 8️⃣ call the likeTweet function from smart contract
      // INPUT: author and id
      // GOAL: Save the like in the smart contract
      // HINT: don't forget to use await 😉 👇
    } catch (error) {
      console.error("User rejected request:", error);
    }
  };

  const handleConnect = (address) => {
    setUserAddress(address);
    setConnected(true);
  };

  return (
    <div>
      <div id="connectMessage" style={{ display: connected ? 'none' : 'block' }}>
        <button onClick={() => handleConnect('0x1234567890abcdef')}>Connect</button>
      </div>
      <div id="tweetForm" style={{ display: connected ? 'block' : 'none' }}>
        <p id="userAddress">Connected: {shortAddress(userAddress)}</p>
        {/* Add form elements here */}
      </div>
    </div>
  );
}

export default App;