import { HiCheckCircle } from "react-icons/hi";
import InfiniteScroll from "react-infinite-scroll-component";

import { Card } from "~/components/ui/Card";
import { GradientBar } from "~/components/ui/GradientBar";
import { LoadingFallback } from "~/components/ui/Fallbacks/LoadingFallback";
import { TrendingTweetsPostCard } from "../Post/TrendingTweetsPostCard";
import { ErrorFallback } from "~/components/ui/Fallbacks/ErrorFallback";
import React, { useState, useEffect } from "react";
import { SEO } from "../SEO";
import { IndeterminateProgress } from "../ui/Progress";
import { WhoToFollow } from "./WhoToFollow";
import axios from "axios";

export function TwitterFeed({ currentUser }) {
  let fetchMore;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const FoxxiOfficialUser = {
    id: "1",
    username: "FoxxiOfficial",
    name: "Foxxi",
    image: "https://placekitten.com/200/300",
    bio: "Foxxi is a social media platform for the community.",
    email: "foxxi@foxxi.com",
    coverImage: "https://placekitten.com/1980/300",
  };

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      let tempData = [];
      const response = await axios.get(
        "http://localhost:5000/api/tweets/trending",
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      response.data.forEach((tweet) => {
        tempData.push({
          author: FoxxiOfficialUser,
          caption: tweet.text,
          createdAt: tweet.created_at,
          id: tweet.id,
          hashtags: [],
        });
      });

      setData(tempData);
      console.log(tempData);
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
        message="Failed to fetch TwitterFeed for you. Try reloading."
      />
    );
  }
  if (!data) {
    return <h1></h1>;
  }

  return data ? (
    data.length > 0 ? (
      <>
        <SEO
          title="Explore · Foxxi"
          description="Explore community posts and posts from people you follow."
        />
        <main className="lg:col-span-7 xl:col-span-6 lg:grid lg:grid-cols-12 lg:gap-3">
          <div className="px-4 lg:col-span-12 -mt-3">
            <InfiniteScroll
              dataLength={data.length}
              loader={<IndeterminateProgress />}
              endMessage={<EndMessage />}
            >
              {data.length > 0
                ? data.map((post, index) => {
                    return (
                      <div key={index}>
                        <TrendingTweetsPostCard
                          post={post}
                          username={currentUser.username}
                          currentUser={currentUser}
                        />
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
            Empty TwitterFeed? Follow people to see their posts.
          </span>
        </div>
      </div>
    </Card>
  );
}
