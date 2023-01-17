import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useMoralis } from "react-moralis";
import InfiniteScroll from "react-infinite-scroll-component";
import { HiCheckCircle } from "react-icons/hi";

import { Card } from "src/components/ui/Card";
import { StoryCard } from "src/components/Post/StoryCard";
import { PostPageLayout } from "src/components/Common/Layouts/PostPageLayout";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import { ErrorFallback } from "src/components/ui/Fallbacks/ErrorFallback";
import { IndeterminateProgress } from "src/components/ui/Progress";
import { FeedPostCard } from "src/components/Post/FeedPostCard";
import { GradientBar } from "src/components/ui/GradientBar";
import { Button } from "src/components/ui/Button";

export default function Post({ currentUser }) {
  const router = useRouter();
  const username = router.query.username;
  console.log(username);
  const { account, deactivateWeb3 } = useMoralis();
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  const getStories = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/story/${username}`,
      {
        headers: {
          cookies: document.cookie,
        },
      }
    );

    console.log("Response data: ", response.data);

    setData(response.data);
  };

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
      if (
        account &&
        currentUser.accountWallet &&
        account !== currentUser.accountWallet
      ) {
        toast.error("Detected Sign In With Different Wallet!");
        sendSignInRequest();
      }
    }
    getStories();
  }, [account]);

  if (error) {
    return (
      <ErrorFallback
        action={() => {}}
        message="Failed to fetch Feed for you. Try reloading."
      />
    );
  }

  return (
    <div className="mt-20">
      <div className="absolute-left-24 top-5">
        <Button variant="dark" onClick={() => router.push("/feed")}>
          ← Back
        </Button>
      </div>
      {data ? (
        data.length > 0 ? (
          <InfiniteScroll
            dataLength={data.length}
            loader={<IndeterminateProgress />}
            endMessage={<EndMessage />}
          >
            {data && data.length > 0
              ? data.map((post, index) => {
                  return (
                    <div key={index}>
                      <StoryCard
                        post={post}
                        username={currentUser.username}
                        currentUser={currentUser}
                      />
                    </div>
                  );
                })
              : null}
          </InfiniteScroll>
        ) : (
          <InfiniteScroll
            dataLength={0}
            loader={<IndeterminateProgress />}
            endMessage={<EndMessage />}
          ></InfiniteScroll>
        )
      ) : (
        <LoadingFallback />
      )}
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

function EndMessage() {
  return (
    <Card
      rounded="lg"
      className="bg-white text-gray-900  max-w-2xl  dark:bg-gray-900 dark:text-gray-400 mt-2 overflow-hidden"
    >
      <GradientBar color="pink" />
      <div className="px-4 py-3">
        <div className="flex flex-col items-center justify-center">
          <HiCheckCircle className="w-10 h-10 mb-1 text-brand-500" />
          <p className="font-medium ">You&apos;re All Caught Up ! </p>
          <span className="text-center">
            Empty Story? Follow people to see their stories.
          </span>
        </div>
      </div>
    </Card>
  );
}
