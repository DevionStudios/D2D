import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import { Navbar } from "src/components/Common/Navbar";
import { UserMessageResult } from "../../components/Chat/UserContainer";
import { ErrorFallback } from "src/components/ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";

export default function UserMessagePage({ currentUser }) {
  const { account, deactivateWeb3 } = useMoralis();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  const getUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/messages/users`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );

      setUsers(data);
    } catch (e) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  if (error) {
    return (
      <>
        <ErrorFallback
          action={() => {}}
          message="Failed to fetch Feed for you. Try reloading."
        />
      </>
    );
  }
  if (loading) {
    return (
      <>
        <LoadingFallback />
      </>
    );
  }

  return (
    <>
      <Navbar currentUser={currentUser} />
      <UserMessageResult data={users} />
    </>
  );
}

UserMessagePage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
