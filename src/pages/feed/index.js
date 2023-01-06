import { FeedLayout } from "src/components/Common/Layouts/FeedLayout";
import { Navbar } from "src/components/Common/Navbar";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";
export default function FeedPage({ currentUser }) {
  const { account, deactivateWeb3 } = useMoralis();
  const [accountWallet, setAccountWallet] = useState(null);
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
      console.log(res.data);
      if (res.status == 200) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        var date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
        document.cookie =
          jwtToken + ";expires=" + date.toUTCString() + ";path=/";
        toast.success("Signed In Successfully");
        window.location.reload();
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
      if (
        account &&
        currentUser.accountWallet &&
        account !== currentUser.accountWallet
      ) {
        toast.error("Detected Sign In With Different Wallet!");
        sendSignInRequest();
      }
    }
  }, [account]);
  return (
    <>
      <Navbar currentUser={currentUser} />
      <FeedLayout currentUser={currentUser} />
    </>
  );
}

FeedPage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
