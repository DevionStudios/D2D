import { set } from "nprogress";
import React, { useState, useEffect } from "react";

const ConnectUnisatWallet = ({ isFromSignUp }) => {
  const [unisat, setUnisat] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    async function loadUnisat() {
      if (typeof window.unisat !== "undefined") {
        setUnisat(window.unisat);

        try {
          let accounts = await window.unisat.getAccounts();
          setUserAddress(accounts[0]);
          if (isFromSignUp) {
            localStorage.setItem("walletType", "bitcoin");
            localStorage.setItem("walletAddress", accounts[0]);
          }
        } catch (error) {
          console.log("connect failed");
        }
      }
    }
    loadUnisat();
  }, [unisat]);

  async function disconnect() {
    setUserAddress("Connect Unisat");

    if (userAddress === "Connect Unisat") {
      connect();
    }
  }

  async function connect() {
    if (typeof window !== undefined && window.unisat) {
      try {
        let accounts = await window.unisat.requestAccounts();
        console.log("connect success", accounts[0]);

        setUserAddress(accounts[0]);
      } catch (e) {
        console.log("connect failed");
      }
    }
  }

  // check isEnabled
  if (unisat && userAddress) {
    return (
      <button className="Connect" onClick={disconnect}>
        {userAddress || "Disconnect Unisat"}
      </button>
    );
  }

  return (
    <button className="Connect" onClick={connect}>
      Connect Unisat
    </button>
  );
};

export default ConnectUnisatWallet;
