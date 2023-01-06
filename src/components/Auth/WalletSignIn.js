import { object, string } from "zod";
import { Input } from "../ui/Input";
import Form, { useZodForm } from "src/components/ui/Form/Form";
import { Link } from "../ui/Link";
import { WalletAuthLayout } from "./WalletAuthLayout";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import FormSubmitButton from "../ui/Form/SubmitButton";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import axios from "axios";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

export function WalletSignIn() {
  const { account, deactivateWeb3 } = useMoralis();
  const [accountWallet, setAccountWallet] = useState();
  const router = useRouter();
  const processSignIn = async () => {
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
        router.push("/feed");
      } else {
        toast.error("Wallet is not registered! Please sign up first!");
        await deactivateWeb3();
      }
    } catch (error) {
      toast.error("Wallet is not registered! Please sign up first!");
      await deactivateWeb3();
    }
  };
  useEffect(() => {
    setAccountWallet(account);
    if (account) processSignIn();
  }, [account]);
  return (
    <WalletAuthLayout
      title="Sign In."
      subtitle="Welcome back! Sign in to your Decentralised To Decentralised account."
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
