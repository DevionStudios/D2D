import React, { useState, useEffect } from "react";

const ConnectDpalWallet = () => {
  const [doge, setDoge] = useState(null);
  const [userAddress, setUserAddress] = useState("Connect Dpal");

  useEffect(() => {
    async function loadDoge() {
      if (typeof window !== undefined && window?.DogeApi) {
        setDoge(window?.DogeApi);
        setUserAddress((await window?.DogeApi?.userAddress()).userAddress);
      }

    } 
    loadDoge();
  }, [doge]);

  async function disconnect() {
    setUserAddress("Connect Dpal");

    if(userAddress === "Connect Dpal") {
      connect();
    }
  }
  
  async function connect() {
    if(typeof window !== undefined && window?.DogeApi) {
      const { status } = await doge.enable();
      if ( status === 'success') {
        setUserAddress((await window?.DogeApi?.userAddress()).userAddress);
      }
    }
  }

  // check isEnabled
  if (typeof window !== undefined && doge && (doge.isEnabled())) {
    return (
      <button className="Connect" onClick={disconnect}>
        {userAddress}
      </button>
    );
  }

  return (
    <button className="Connect" onClick={connect}>
      Connect Dpal Wallet
    </button>
  ); 
};

export default ConnectDpalWallet;
