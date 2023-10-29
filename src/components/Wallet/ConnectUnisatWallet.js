import React, { useState } from "react";
import { resetWalletCookie, setWalletCookie } from "../../utils/getCookie";
import Image from "next/image";
import { toast } from "react-hot-toast";
const ConnectUnisatWallet = ({ currentUser, text, image, setClose }) => {
  const [unisat, setUnisat] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  async function disconnect() {
    setUserAddress("Connect Unisat");
    resetWalletCookie(document);
    if (userAddress === "Connect Unisat") {
      connect();
    }
  }

  async function connect() {
    if (typeof window !== undefined && window.unisat) {
      try {
        let accounts = await window.unisat.requestAccounts();
        resetWalletCookie(document);
        setWalletCookie(document, {
          activeWallet: accounts[0],
          ordinalWalletAddress: accounts[0],
          stampWalletAddress: accounts[0],
        });

        setUserAddress(accounts[0]);
        toast.success("Connected to Unisat");
        setClose(false);
      } catch (e) {
        console.log("connect failed");
      }
    }
  }

  // check isEnabled
  if (userAddress) {
    return (
      <button className={text || ""} onClick={disconnect}>
        {image ? (
          <Image src={image} alt="Dpal" width="60%" height="60%" />
        ) : null}
        <br />
        {userAddress?.toString()?.slice(0, 5) || "Disconnect Unisat"}
        {userAddress && "..."}
      </button>
    );
  }

  return (
    <button className={text || ""} onClick={connect}>
      {image ? <Image src={image} alt="Dpal" width="60%" height="60%" /> : null}
      <br />
      Connect Unisat
    </button>
  );
};

export default ConnectUnisatWallet;
