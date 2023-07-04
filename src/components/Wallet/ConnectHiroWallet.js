import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { setWalletCookie } from "../../utils/getCookie";
import axios from "axios";

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

const ConnectHiroWallet = ({ text, currentUser }) => {
  const [mounted, setMounted] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  async function updateWalletAddress(hiroAddresses) {
    console.log("hiroAddresses: ", hiroAddresses);
    console.log("currentUser: ", currentUser);
    // p2wpkh - stamps, p2tr - ordinal
    if (
      currentUser &&
      !currentUser.ordinalAddress &&
      !currentUser.stampAddress
    ) {
      try {
        const formdata = new FormData();
        formdata.append("stampAddress", hiroAddresses.p2wpkh.mainnet);
        formdata.append("ordinalAddress", hiroAddresses.p2tr.mainnet);

        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/update`,
          formdata,
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );

        console.log("res: ", res);
      } catch (e) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    setMounted(true);

    if (userSession.isUserSignedIn()) {
      updateWalletAddress(userSession.loadUserData().profile.btcAddress);

      setWalletAddress(userSession.loadUserData().profile.stxAddress.testnet);
      setWalletCookie(document, {
        hiroWallet: userSession.loadUserData().profile.stxAddress.testnet,
        walletType: "hiroWallet",
      });
    }
  }, [walletAddress]);

  if (mounted && userSession.isUserSignedIn()) {
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
