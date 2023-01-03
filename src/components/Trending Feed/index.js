import { HiCheckCircle } from "react-icons/hi";
import InfiniteScroll from "react-infinite-scroll-component";
import { TwitterApi } from "twitter-api-v2";

import { Card } from "~/components/ui/Card";
import { GradientBar } from "~/components/ui/GradientBar";
import { LoadingFallback } from "~/components/ui/Fallbacks/LoadingFallback";
import { FeedPostCard } from "../Post/FeedPostCard";
import { ErrorFallback } from "~/components/ui/Fallbacks/ErrorFallback";
import React, { useState, useEffect } from "react";
import { SEO } from "../SEO";
import { IndeterminateProgress } from "../ui/Progress";
import { WhoToFollow } from "./WhoToFollow";
import axios from "axios";

export function TrendingFeed({ currentUser }) {
  let fetchMore;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/posts/trending"
      );
      setData(response.data);
      console.log(process.env.TWITTER_API_KEY);

      // * Get trending tweets from Twitter API
      const TwitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_KEY_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        accessSecret: process.env.ACCESS_TOKEN_SECRET,
      });
      const appOnlyClientFromConsumer = await TwitterClient.appLogin();

      const trendingApiResponse = await appOnlyClientFromConsumer.v2.search(
        "trending",
        {
          maxResults: 10,
          tweet: {
            fields: ["created_at"],
          },
        }
      );

      console.log(trendingApiResponse);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllPosts();
  }, []);
  if (error) {
    return (
      <ErrorFallback
        action={() => {}}
        message="Failed to fetch TrendingFeed for you. Try reloading."
      />
    );
  }
  if (!data) {
    return <h1></h1>;
  }

  // function handleNext() {
  //   fetchMore({
  //     variables: {
  //       first: 10,
  //       after: data?.feed.pageInfo.endCursor,
  //     },
  //   });
  // }

  return data ? (
    data.length > 0 ? (
      <>
        <SEO
          title="Explore · D2D"
          description="Explore community posts and posts from people you follow."
        />
        <main className="lg:col-span-7 xl:col-span-6 lg:grid lg:grid-cols-12 lg:gap-3">
          <div className="px-4 lg:col-span-12 -mt-3">
            <InfiniteScroll
              // hasMore={data.feed.pageInfo.hasNextPage}
              // next={handleNext}
              dataLength={data.length}
              loader={<IndeterminateProgress />}
              endMessage={<EndMessage />}
            >
              {data.length > 0
                ? data.map((post, index) => {
                    return (
                      <div key={index}>
                        <FeedPostCard
                          post={post}
                          username={currentUser.username}
                          currentUser={currentUser}
                        />
                        {index === 5 || index === 10 ? <WhoToFollow /> : null}
                      </div>
                    );
                  })
                : null}
            </InfiniteScroll>
          </div>
        </main>
      </>
    ) : (
      <InfiniteScroll
        // hasMore={data.feed.pageInfo.hasNextPage}
        // next={handleNext}
        dataLength={0}
        loader={<IndeterminateProgress />}
        endMessage={<EndMessage />}
      ></InfiniteScroll>
    )
  ) : (
    <LoadingFallback />
  );
}

export function EndMessage() {
  return (
    <Card
      rounded="lg"
      className="bg-white max-w-2xl dark:bg-gray-700 mt-2 overflow-hidden"
    >
      <GradientBar color="pink" />
      <div className="px-4 py-3">
        <div className="flex flex-col items-center justify-center">
          <HiCheckCircle className="w-10 h-10 mb-1 text-brand-500" />
          <p className="font-medium ">You&apos;re All Caught Up ! </p>
          <span className="text-center">
            Empty TrendingFeed? Follow people to see their posts.
          </span>
        </div>
      </div>
    </Card>
  );
}
