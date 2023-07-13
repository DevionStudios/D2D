import { set } from "nprogress";
import React, { useState, useEffect } from "react";
import { setWalletCookie } from "../../utils/getCookie";
import Image from "next/image";
const ConnectUnisatWallet = ({ text, image }) => {
  const [unisat, setUnisat] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    async function loadUnisat() {
      if (typeof window.unisat !== "undefined") {
        setUnisat(window.unisat);

        try {
          let accounts = await window.unisat.getAccounts();
          setUserAddress(accounts[0]);
          setWalletCookie(document, {
            unisatWallet: userAddress,
            walletType: "unisatWallet",
          });
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
        setWalletCookie(document, {
          unisatWallet: accounts[0],
          walletType: "unisatWallet",
        });

        console.log("connect unisat", accounts);

        setUserAddress(accounts[0]);
      } catch (e) {
        console.log("connect failed");
      }
    }
  }

  // check isEnabled
  if (unisat && userAddress) {
    return (
      <div>
        {image ? <Image src={image} alt="Dpal" width={30} height={30} /> : null}
        <button className={text || ""} onClick={disconnect}>
          {userAddress?.toString()?.slice(0, 5) || "Disconnect Unisat"}
          {userAddress && "..."}
        </button>
      </div>
    );
  }

  return (
    <div>
      {image ? <Image src={image} alt="Dpal" width={30} height={30} /> : null}
      <button className={text || ""} onClick={connect}>
        Connect Unisat
      </button>
    </div>
  );
};

export default ConnectUnisatWallet;
