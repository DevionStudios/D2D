import React, { useState, useEffect } from "react";
import { setWalletCookie, resetWalletCookie } from "../../utils/getCookie";
import Image from "next/image";
import { toast } from "react-hot-toast";
const ConnectDpalWallet = ({ text, image, setClose }) => {
  const [doge, setDoge] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    async function loadDoge() {
      if (typeof window !== undefined && window?.DogeApi) {
        setDoge(window?.DogeApi);

        if (window?.DogeApi && window?.DogeApi?.isEnabled()) {
          setUserAddress((await window?.DogeApi?.userAddress()).userAddress);
          resetWalletCookie(document);
          setWalletCookie(document, {
            activeWallet: userAddress,
          });
        }
      }
    }
    loadDoge();
  }, [doge]);

  async function disconnect() {
    setUserAddress("Connect Dpal");

    if (userAddress === "Connect Dpal") {
      connect();
    }
  }

  async function connect() {
    if (typeof window !== undefined && window?.DogeApi) {
      const { status } = await doge.enable();
      if (status === "success") {
        setUserAddress((await window?.DogeApi?.userAddress()).userAddress);
        resetWalletCookie(document);
        setWalletCookie(document, {
          activeWallet: userAddress,
        });
        toast.success("Connected to Dpal");

        setClose(false);
      }
    }
  }

  // check isEnabled
  if (doge && doge.isEnabled() && userAddress) {
    return (
      <button className={text || ""} onClick={disconnect}>
        {image ? (
          <Image src={image} alt="Dpal" width={"60%"} height={"60%"} />
        ) : null}
        <br />
        {userAddress.toString()?.slice(0, 5) || "Disconnect Dpal"}
        {userAddress && "..."}
      </button>
    );
  }

  return (
    <button className={text || ""} onClick={connect}>
      {image ? (
        <Image src={image} alt="Dpal" width={"60%"} height={"60%"} />
      ) : null}
      <br />
      Connect Dpal
    </button>
  );
};

export default ConnectDpalWallet;
