import React, { useState } from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { resetWalletCookie, setWalletCookie } from "../../utils/getCookie";
import Image from "next/image";
const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

const ConnectHiroWallet = ({ text, currentUser, image, setClose }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  function authenticate() {
    showConnect({
      appDetails: {
        name: "Foxxi",
        icon: "/src/assets/Foxxi-Text.png",
      },
      onFinish: async (props) => {
        console.log("props: ", props);
        setWalletAddress(
          props.authResponsePayload.profile.btcAddress.p2wpkh.mainnet
        );
        resetWalletCookie(document);
        setWalletCookie(document, {
          activeWallet:
            props.authResponsePayload.profile.btcAddress.p2wpkh.mainnet, // stamp address
          stampWalletAddress:
            props.authResponsePayload.profile.btcAddress.p2wpkh.mainnet,
          ordinalWalletAddress:
            props.authResponsePayload.profile.btcAddress.p2tr.mainnet,
        });
        setClose(false);
        // window.location.reload();
      },
      redirectTo: "/feed",
      userSession,
    });
  }

  function disconnect() {
    // clear all cookies
    resetWalletCookie(document);
    userSession.signUserOut(window.location.href);
  }

  if (walletAddress) {
    return (
      <button className={text || ""} onClick={disconnect}>
        {image ? (
          <Image src={image} alt="Hiro" width={"60%"} height={"60%"} />
        ) : null}
        {walletAddress?.toString()?.slice(0, 5) || "Disconnect Hiro"}
        {walletAddress && "..."}
      </button>
    );
  }

  return (
    <button className={text || ""} onClick={authenticate}>
      {image ? (
        <Image src={image} alt="Hiro" width={"60%"} height={"60%"} />
      ) : null}
      <br />
      Connect Hiro
    </button>
  );
};

export default ConnectHiroWallet;
