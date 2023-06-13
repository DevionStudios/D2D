import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Foxxi",
      icon: window.location.origin + "/logo512.png",
    },
    onFinish: () => {},
    redirectTo: window.location.href,
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut(window.location.href);
}

const ConnectWallet = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (mounted && userSession.isUserSignedIn()) {
    return (
      <button className="Connect" onClick={disconnect}>
        Disconnect Hiro Wallet
      </button>
    );
  }

  return (
    <button className="Connect" onClick={authenticate}>
      Connect Hiro
    </button>
  );
};

export default ConnectWallet;
