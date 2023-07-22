import { Navbar } from "src/components/Common/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-hot-toast";
import axios from "axios";
import CardsLayout from "../../../components/Profile/Cards";
export default function AccountPage({ currentUser }) {
  const router = useRouter();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (currentUser?.annonymous === true) {
      router.push("/feed");
    }
  }, [currentUser]);

  const { account, deactivateWeb3 } = useMoralis();
  const username = router.query?.username;

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
    // if (!currentUser?.email && !currentUser?.annonymous) {
    //   if (!currentUser.accountWallet) {
    //     toast.error(
    //       "You are not signed in! You are being redirected to sign in page!"
    //     );
    //     router.push("/auth/walletsignin");
    //     return;
    //   }
    //   let cookies = document?.cookie;
    //   // check if foxxi_user_wallet cookie exists
    //   let walletCookie = cookies
    //     ?.split("foxxi_user_wallet=")?.[1]
    //     ?.split(";")?.[0];
    //   if (walletCookie) {
    //     walletCookie = JSON.parse(walletCookie);
    //   }
    //   if (
    //     walletCookie?.activeWallet &&
    //     currentUser.accountWallet &&
    //     walletCookie?.activeWallet !== currentUser.accountWallet
    //   ) {
    //     toast.error("Detected Sign In With Different Wallet!");
    //     sendSignInRequest();
    //   }
    //   if (walletCookie?.activeWallet && currentUser.accountWallet) {
    //     toast.error("Detected Sign In With Different Wallet!");
    //     sendSignInRequest();
    //   }
    // }
  }, [account]);

  const fetchUserProfile = async function () {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/otheruser/${username}`
      );
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
      <Navbar currentUser={currentUser} />
      <CardsLayout currentUser={currentUser} user={user} />
    </>
  );
}

AccountPage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
