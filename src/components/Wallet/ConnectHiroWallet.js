import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import {
  getWalletCookie,
  resetWalletCookie,
  setWalletCookie,
} from "../../utils/getCookie";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-hot-toast";
const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

const ConnectHiroWallet = ({ text, currentUser, image }) => {
  const [mounted, setMounted] = useState(false);
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

  // async function updateWalletAddress(hiroAddresses) {
  //   console.log("Within update function!");

  //   // p2wpkh - stamps, p2tr - ordinal
  //   if (
  //     currentUser &&
  //     !currentUser.ordinalAddress &&
  //     !currentUser.stampAddress
  //   ) {
  //     console.log("Updating the user's addresses");

  //     try {
  //       const formdata = new FormData();
  //       formdata.append("stampAddress", hiroAddresses.p2wpkh.mainnet);
  //       formdata.append("ordinalAddress", hiroAddresses.p2tr.mainnet);
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
  //       console.log("Successfully updated the user's addresses!");
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   setMounted(true);

  //   if (userSession.isUserSignedIn()) {
  //     // updateWalletAddress(userSession.loadUserData().profile.btcAddress);
  //     console.log(userSession.loadUserData().profile.btcAddress);
  //     resetWalletCookie(document);
  //     setWalletAddress(
  //       userSession.loadUserData().profile.btcAddress.p2tr.mainnet
  //     );
  //     setWalletCookie(document, {
  //       activeWallet:
  //         userSession.loadUserData().profile.btcAddress.p2wpkh.mainnet,
  //       stampWalletAddress:
  //         userSession.loadUserData().profile.btcAddress.p2wpkh.mainnet,
  //       ordinalWalletAddress:
  //         userSession.loadUserData().profile.btcAddress.p2tr.mainnet,
  //     });
  //   }
  // }, [walletAddress]);

  if (walletAddress) {
    return (
      <div>
        <div>
          {image ? (
            <Image src={image} alt="Dpal" width={30} height={30} />
          ) : null}
        </div>
        <div>
          <button className={text || ""} onClick={disconnect}>
            {walletAddress?.toString()?.slice(0, 5) || "Disconnect Hiro"}
            {walletAddress && "..."}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {image ? <Image src={image} alt="Dpal" width={30} height={30} /> : null}
      </div>
      <button className={text || ""} onClick={authenticate}>
        Connect Hiro
      </button>
    </div>
  );
};

export default ConnectHiroWallet;
