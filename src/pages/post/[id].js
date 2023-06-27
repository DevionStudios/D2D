import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useMoralis } from "react-moralis";

import { PostCard } from "src/components/Post/PostCard";
import { PostPageLayout } from "src/components/Common/Layouts/PostPageLayout";
export default function Post({ currentUser }) {
  const router = useRouter();
  const id = router.query.id;
  const { account, deactivateWeb3 } = useMoralis();

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

      let wallet = undefined;
      if (
        window.localStorage.getItem("walletAddress") !== undefined ||
        window.localStorage.getItem("walletAddress") !== null
      )
        wallet = window.localStorage.getItem("walletAddress");
      if (
        wallet &&
        currentUser.accountWallet &&
        wallet !== currentUser.accountWallet
      ) {
        toast.error("Detected Sign In With Different Wallet!");
        sendSignInRequest();
      }
    }
  }, [account]);
  return (
    <div className="mt-20">
      <PostCard
        id={id}
        username={currentUser.username}
        currentUser={currentUser}
      />
    </div>
  );
}

Post.getLayout = function getLayout(page) {
  return (
    <>
      <PostPageLayout>{page}</PostPageLayout>
    </>
  );
};
