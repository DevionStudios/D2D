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

const ConnectHiroWallet = () => {
  const [mounted, setMounted] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    setMounted(true);

    if (userSession.isUserSignedIn()) {
      setWalletAddress(userSession.loadUserData().profile.stxAddress.testnet);
      setWalletCookie(document, {
        hiroWallet: userSession.loadUserData().profile.stxAddress.testnet,
      });
    }
  }, [walletAddress]);

  if (mounted && userSession.isUserSignedIn()) {
    // setWalletAddress(userSession.loadUserData().profile.stxAddress.testnet);

    return (
      <button className="Connect" onClick={disconnect}>
        {walletAddress || "Disconnect Hiro"}
      </button>
    );
  }

  return (
    <button className="Connect" onClick={authenticate}>
      Connect Hiro
    </button>
  );
};

export default ConnectHiroWallet;
