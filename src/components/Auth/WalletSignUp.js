import toast from "react-hot-toast";
import { z } from "zod";
import { Card } from "../ui/Card";
import Form, { useZodForm } from "../ui/Form/Form";
import FormSubmitButton from "../ui/Form/SubmitButton";
import { Input } from "../ui/Input";
import { Link } from "../ui/Link";
import { WalletAuthLayout } from "./WalletAuthLayout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { getWalletCookie, setWalletCookie } from "../../utils/getCookie";

const WalletSignUpSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(2),
});

export function WalletSignUp({ currentUser }) {
  const { account } = useMoralis();
  const [accountWallet, setAccountWallet] = useState(undefined);
  const [walletType, setWalletType] = useState(undefined);
  useEffect(() => {
    let cookies = document?.cookie;
    // check if foxxi_user_wallet cookie exists
    let cookie = cookies?.split("foxxi_user_wallet=")?.[1]?.split(";")?.[0];
    if (cookie) {
      cookie = JSON.parse(cookie);
      setWalletType(cookie.walletType);
    }
  }, []);
  const form = useZodForm({
    schema: WalletSignUpSchema,
  });
  const router = useRouter();
  const processSignUp = async (values) => {
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/signup`,
        {
          accountWallet: currentUsedWallet,
          name: values.name,
          username: values.username,
          walletType: walletType,
        },
        { withCredentials: true }
      );
      if (res.status == 201) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        document.cookie = jwtToken + ";path=/";
        setWalletCookie(document, {
          activeWallet: currentUsedWallet,
          walletConnectWallet: walletCookie.walletConnectWallet,
          hiroWallet: walletCookie.hiroWallet,
          unisatWallet: walletCookie.unisatWallet,
          dogeWallet: walletCookie.dogeWallet,
          walletType: walletType,
        });
        toast.success("Account Created Successfully");
        router.push("/onboarding");
      } else {
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
        toast.error("Error Occured! Check If Wallet is already registered!");
      }
    } catch (error) {
      // delete all cookie
      // clear all cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      toast.error("Error Occured! Check If Wallet is already registered!");
    }
  };
  return (
    <>
      <WalletAuthLayout
        title="Sign Up."
        subtitle="Sign up and join the Foxxi! Note: The last wallet that you log in to will be used as primary sign up wallet"
        currentUser={currentUser}
      >
        <Form
          form={form}
          onSubmit={async (values) => {
            await processSignUp(values);
          }}
        >
          <Input
            label="Full Name"
            type="text"
            placeholder="Your Full Name"
            {...form.register("name")}
          />
          <Input
            label="Username"
            type="text"
            placeholder="Your Username (min 3)"
            {...form.register("username")}
          />
          <FormSubmitButton size="lg">Wallet Sign Up</FormSubmitButton>
        </Form>

        <div>
          <Card rounded="lg" className="mt-4">
            <Card.Body>
              <span className="mr-1">Already have an account ?</span>
              <Link
                className="font-medium text-brand-600 hover:text-brand-400"
                href="/auth/walletsignin"
              >
                Log In Using Wallet
              </Link>
            </Card.Body>
          </Card>
          <Card rounded="lg" className="mt-4">
            <Card.Body>
              <span className="mr-1">Want to sign up using email?</span>
              <Link
                className="font-medium text-brand-600 hover:text-brand-400"
                href="/auth/signup"
              >
                Join Foxxi™
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
        <div></div>
      </WalletAuthLayout>
    </>
  );
}
