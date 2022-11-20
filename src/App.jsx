import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";










const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [allWaves, setAllWaves] = useState([]);
    const contractAddress = "0xe63e220219d6df8E02baC414251233DA336BB5Fd";
    const contractABI = abi.abi;
    const getEthereumObject = () => window.ethereum;
    const [message, setMsg] = useState('');
    const handleSubmit = (e) => {
      e.preventDefault();
      const wav = { message };
      console.log(wav);
    }

  
    const findMetaMaskAccount = async () => {
      try {
        const { ethereum } = window;
    
       
        if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }
  
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        getAllWaves();
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }






  

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*CONTRACT GOOD THRU HERE*/

        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    findMetaMaskAccount();
  }, [])




const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }


/* this helped capture the form submission*/
  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  



 return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          🎧 Listen Up!
        </div>

        <div className="bio">
          Connect your wallet and send me a wav!
        </div>

        <button className="waveButton" onClick={wave}>
          Wav at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

      <div className="waveButton">
      <form onSubmit={handleSubmit}>
        <label> Send a wav bruh:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="waveButton" onClick={wave}>
        Send
        </button>
      <p> { message } </p>
      
      </form>
      </div>
        
        

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>

              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App