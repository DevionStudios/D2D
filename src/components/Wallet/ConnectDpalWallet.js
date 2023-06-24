import React, { useState, useEffect } from "react";

const ConnectDpalWallet = () => {
  const [doge, setDoge] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    async function loadDoge() {
      if (typeof window !== undefined && window?.DogeApi) {
        setDoge(window?.DogeApi);

        if (window?.DogeApi && (window?.DogeApi?.isEnabled())) 
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
  if (doge && (doge.isEnabled()) && userAddress) {
    return (
      <button className="Connect" onClick={disconnect}>
        {userAddress || "Disconnect Dpal" }
      </button>
    );
  }

  return (
    <button className="Connect" onClick={connect}>
      Connect Dpal 
    </button>
  ); 
};

export default ConnectDpalWallet;
