import { Link } from "../ui/Link";
import { WalletAuthLayout } from "./WalletAuthLayout";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { setWalletCookie } from "../../utils/getCookie";
export function WalletSignIn() {
  const { account, deactivateWeb3 } = useMoralis();
  const [accountWallet, setAccountWallet] = useState();
  const [walletType, setWalletType] = useState(undefined);
  const router = useRouter();
  useEffect(() => {
    let cookies = document?.cookie;
    // check if foxxi_user_wallet cookie exists
    let cookie = cookies?.split("foxxi_user_wallet=")?.[1]?.split(";")?.[0];
    if (cookie) {
      cookie = JSON.parse(cookie);
      setWalletType(cookie.walletType);
      processSignIn();
    }
  }, []);

  const processSignIn = async () => {
    let cookies = document?.cookie;
    // check if foxxi_user_wallet cookie exists
    let walletCookie = cookies
      ?.split("foxxi_user_wallet=")?.[1]
      ?.split(";")?.[0];
    if (walletCookie) {
      walletCookie = JSON.parse(walletCookie);
      setWalletType(walletCookie.walletType);
    }
    const walletType = walletCookie?.walletType;
    // first check type
    if (!walletType)
      return toast.error("Please select a wallet to sign up with!");
    console.log(walletCookie);
    let currentUsedWallet;
    if (walletType == "walletConnect")
      currentUsedWallet = walletCookie.walletConnectWallet;
    else if (walletType == "hiroWallet")
      currentUsedWallet = walletCookie.hiroWallet;
    else if (walletType == "unisatWallet")
      currentUsedWallet = walletCookie.unisatWallet;
    else if (walletType == "dogeWallet")
      currentUsedWallet = walletCookie.dogeWallet;

    if (currentUsedWallet == undefined) {
      toast.error("Please connect your wallet first");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/signin`,
        {
          accountWallet: currentUsedWallet,
        },
        { withCredentials: true }
      );
      if (res.status == 200) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        document.cookie = jwtToken + ";path=/";
        toast.success("Signed In Successfully");
        setWalletCookie(document, {
          activeWallet: currentUsedWallet,
          walletConnectWallet: walletCookie.walletConnectWallet,
          hiroWallet: walletCookie.hiroWallet,
          unisatWallet: walletCookie.unisatWallet,
          dogeWallet: walletCookie.dogeWallet,
          walletType: walletType,
        });
        router.push("/feed");
      } else {
        toast.error("Wallet is not registered! Please sign up first!");
        // delete all cookie
        // clear all cookies
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
        await deactivateWeb3();
      }
    } catch (error) {
      // delete all cookie
      // clear all cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      toast.error("Wallet is not registered! Please sign up first!");
      await deactivateWeb3();
    }
  };
  return (
    <WalletAuthLayout
      title="Sign In."
      subtitle="Welcome back! Sign in to your Foxxi account."
      setWalletType={setWalletType}
    >
      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Don’t have an account yet ?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/auth/walletsignup"
            >
              Join with Wallet
            </Link>
          </Card.Body>
        </Card>
      </div>
      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Already have an account ?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/auth/signin"
            >
              Log in with Email
            </Link>
          </Card.Body>
        </Card>
      </div>
      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Don’t want to join yet ?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/feed"
            >
              Browse Annonymously!
            </Link>
          </Card.Body>
        </Card>
      </div>
    </WalletAuthLayout>
  );
}
