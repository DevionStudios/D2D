import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  getWalletCookie,
  resetWalletCookie,
  setWalletCookie,
} from "../../utils/getCookie";
import Image from "next/image";
import { toast } from "react-hot-toast";
const ConnectUnisatWallet = ({ currentUser, text, image }) => {
  const [unisat, setUnisat] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  // async function updateUnisatWalletAddress(address) {
  //   if (!currentUser.unisatAddress) {
  //     const formdata = new FormData();
  //     formdata.append("unisatAddress", address);

  //     try {
  //       const res = await axios.put(
  //         `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/update`,
  //         formdata,
  //         {
  //           headers: {
  //             cookies: document.cookie,
  //           },
  //         }
  //       );
  //       console.log("res: ", res);
  //     } catch (e) {
  //       console.log("Error updating unisat address: ", e);
  //     }
  //   } else {
  //     console.log("User already has a unisat address");
  //   }
  // }

  // useEffect(() => {
  //   async function loadUnisat() {
  //     if (typeof window.unisat !== "undefined") {
  //       setUnisat(window.unisat);

  //       try {
  //         let accounts = await window.unisat.getAccounts();
  //         setUserAddress(accounts[0]);
  //         resetWalletCookie();
  //         setWalletCookie(document, {
  //           activeWallet: userAddress,
  //           ordinalWalletAddress: userAddress,
  //           stampWalletAddress: userAddress,
  //         });

  //         console.log("connect success", accounts[0]);
  //       } catch (error) {
  //         console.log("connect failed");
  //       }
  //     }
  //   }
  //   loadUnisat();
  // }, [unisat]);

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
        // await updateUnisatWalletAddress(accounts[0]);
      } catch (e) {
        console.log("connect failed");
      }
    }
  }

  // check isEnabled
  if (userAddress) {
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
