import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { set } from "nprogress";
import { setWalletCookie } from "../../utils/getCookie";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Foxxi",
      icon: "/src/assets/Foxxi-Text.png",
    },
    onFinish: () => {
      window.location.reload();
    },
    redirectTo: "/feed",
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut(window.location.href);
}

const ConnectHiroWallet = ({ text }) => {
  const [mounted, setMounted] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    setMounted(true);

    if (userSession.isUserSignedIn()) {
      // p2wpkh - stamps, p2tr - ordinal
      console.log("Hiro Addresses: ", userSession.loadUserData().profile);

      setWalletAddress(userSession.loadUserData().profile.stxAddress.testnet);
      setWalletCookie(document, {
        hiroWallet: userSession.loadUserData().profile.stxAddress.testnet,
        walletType: "hiroWallet",
      });
    }
  }, [walletAddress]);

  if (mounted && userSession.isUserSignedIn()) {
    // setWalletAddress(userSession.loadUserData().profile.stxAddress.testnet);

    return (
      <button className={text || ""} onClick={disconnect}>
        {walletAddress?.toString()?.slice(0, 5) || "Disconnect Hiro"}
        {walletAddress && "..."}
      </button>
    );
  }

  return (
    <button className={text || ""} onClick={authenticate}>
      Connect Hiro
    </button>
  );
};

export default ConnectHiroWallet;
