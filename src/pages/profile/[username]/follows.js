import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";

import { Follows } from "src/components/Profile/Follows";

const FollowPage = ({ currentUser }) => {
  const { account, deactivateWeb3 } = useMoralis();
  const router = useRouter();

  const sendSignInRequest = async () => {
    if (account == undefined) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/signin`,
        {
          accountWallet: account,
        },
        { withCredentials: true }
      );
      if (res.status == 200) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        document.cookie = jwtToken + ";path=/";
        toast.success("Signed In Successfully");
        router.push("/feed");
      } else {
        toast.error("Wallet is not registered! Please sign up first!");
        await deactivateWeb3();
        // clear all cookies
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
        router.push("/auth/walletsignin");
      }
    } catch (error) {
      toast.error("Wallet is not registered! Please sign up first!");
      await deactivateWeb3();
      // clear all cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      router.push("/auth/walletsignin");
    }
  };
  useEffect(() => {
    if (!currentUser?.email && !currentUser?.annonymous) {
      if (!currentUser.accountWallet) {
        toast.error(
          "You are not signed in! You are being redirected to sign in page!"
        );
        router.push("/auth/walletsignin");
        return;
      }
      let cookies = document?.cookie;
      // check if foxxi_user_wallet cookie exists
      let walletCookie = cookies
        ?.split("foxxi_user_wallet=")?.[1]
        ?.split(";")?.[0];
      if (walletCookie) {
        walletCookie = JSON.parse(walletCookie);
      }
      if (
        walletCookie?.activeWallet &&
        currentUser.accountWallet &&
        walletCookie?.activeWallet !== currentUser.accountWallet
      ) {
        toast.error("Detected Sign In With Different Wallet!");
        sendSignInRequest();
      }
    }
  }, [account]);
  return <Follows currentUser={currentUser} />;
};

export default FollowPage;
