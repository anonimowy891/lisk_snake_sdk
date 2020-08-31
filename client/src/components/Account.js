import React, { useState } from "react";
import "./Account.css";
import {
  nodes, initAccount, initPass
} from "../config/config.json";

const passphrase = require("@liskhq/lisk-passphrase");
const cryptography = require("@liskhq/lisk-cryptography");
const { APIClient } = require("@liskhq/lisk-api-client");
const transactions = require("@liskhq/lisk-transactions");


const Account = ({
  loggedIn,
  login,
  logout,
  userAddress,
  userBalance,
  lsnConsole,
  updateBalance,
}) => {
  const [userPassphrase, setUserPassphrase] = useState("");

  const createAccount = () => {
    const { Mnemonic } = passphrase;
    let userPassphrase = Mnemonic.generateMnemonic();
    setUserPassphrase(userPassphrase);
    let userAddress = cryptography.getAddressFromPassphrase(userPassphrase);
    lsnConsole(
      `Generated new passphrase: ${userPassphrase}\nFor address: ${userAddress}`
    );
    
  };

  const handleChange = (data) => {
    setUserPassphrase(data.target.value.trim());
  };

  

  const InitButton = () => {

    const networkIdentifier = cryptography.getNetworkIdentifier(
      "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
      "Lisk"
    ); 
    const client = new APIClient(nodes); 
    
    const tx = new transactions.TransferTransaction({
      asset: {
        recipientId: userAddress,
        amount: transactions.utils.convertLSKToBeddows("100"),
      },
      networkIdentifier: networkIdentifier,
      timestamp: transactions.utils.getTimeFromBlockchainEpoch(new Date()),
    });
    
    client.transactions.get({ recipientId: userAddress, senderId: initAccount }).then((res) => 
    {
    
    if (res.data[0] == undefined)
    {
      tx.sign(initPass);
      console.log(tx);
      
      client.transactions
    .broadcast(tx.toJSON())
    .then((res) => {
      console.log(res);
      lsnConsole(`Woohaa you have 100 LSN\n`);
      updateBalance();
    })}
    else
    {
      lsnConsole(`Sorry init amount can be send only one time.\n`);    }
    });    
  } 



  return (
    <div className="account">
      {!loggedIn ? (
        <div id="accountLogin">
          <button onClick={createAccount} className="accountButton">
            Create account
          </button>{" "}
          -{" "}
          <input
            id="passphrase"
            type="text"
            value={userPassphrase}
            onChange={handleChange}
          />{" "}
          <button onClick={() => login(userPassphrase)} className="accountButton">Login</button>
          
        </div>
      ) : (
        <div id="accountStatistics">
          Address: {userAddress} - Balance: {userBalance} LSN -{" "}
          <button onClick={logout} className="accountButton">
            Logout
          </button>{" "}
          <button onClick={InitButton} className="initButton">
            Initilize
          </button>
        </div>
      )}
    </div>
  );
};
export default Account;
