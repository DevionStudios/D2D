import { Link } from "../ui/Link";
import { WalletAuthLayout } from "./WalletAuthLayout";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
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
      if (res.status == 200) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        document.cookie = jwtToken + ";path=/";
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
      subtitle="Welcome back! Sign in to your Foxxi account."
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
