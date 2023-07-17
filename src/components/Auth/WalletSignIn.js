import { Link } from "../ui/Link";
import { WalletAuthLayout } from "./WalletAuthLayout";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { setWalletCookie } from "../../utils/getCookie";
import Form, { useZodForm } from "../ui/Form/Form";
import FormSubmitButton from "../ui/Form/SubmitButton";
import { z } from "zod";
const WalletSignInSchema = z.object({});

export function WalletSignIn({ currentUser }) {
  const { account, deactivateWeb3 } = useMoralis();
  const [accountWallet, setAccountWallet] = useState();
  const [walletType, setWalletType] = useState(undefined);
  const router = useRouter();
  const form = useZodForm({
    schema: WalletSignInSchema,
  });
  useEffect(() => {
    let cookies = document?.cookie;
    // check if foxxi_user_wallet cookie exists
    let cookie = cookies?.split("foxxi_user_wallet=")?.[1]?.split(";")?.[0];
    if (cookie) {
      cookie = JSON.parse(cookie);
      setWalletType(cookie.walletType);
    }
  }, [account]);

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
      currentUsedWallet = walletCookie.walletConnectWallet || account;
    else if (walletType == "hiroWallet")
      currentUsedWallet = walletCookie.hiroWallet || account;
    else if (walletType == "unisatWallet")
      currentUsedWallet = walletCookie.unisatWallet || account;
    else if (walletType == "dogeWallet")
      currentUsedWallet = walletCookie.dogeWallet || account;
    else currentUsedWallet = account;
    console.log(account);
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
          activeWallet: currentUsedWallet || account,
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
      title="Log In."
      subtitle="Welcome back! Log in to your Foxxi account."
      setWalletType={setWalletType}
      currentUser={currentUser}
    >
      <div>
        <Form
          form={form}
          onSubmit={async (values) => {
            await processSignIn(values);
          }}
        >
          <FormSubmitButton size="lg">Wallet Sign In</FormSubmitButton>
        </Form>
        <Card rounded="lg" className="mt-12">
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
              Primitive Login
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
