import { HiCheckCircle } from "react-icons/hi";
import InfiniteScroll from "react-infinite-scroll-component";

import { Card } from "src/components/ui/Card";
import { GradientBar } from "src/components/ui/GradientBar";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import { TrendingTweetsPostCard } from "../Post/TrendingTweetsPostCard";
import { ErrorFallback } from "src/components/ui/Fallbacks/ErrorFallback";
import React, { useState, useEffect } from "react";
import { SEO } from "../SEO";
import { IndeterminateProgress } from "../ui/Progress";
import axios, { HttpStatusCode } from "axios";
import Logo from "../../assets/Foxxi Logo.png";
import FoxxiText from "../../assets/Foxxi-Text.png";

export function News({ currentUser }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const FoxxiOfficialUser = {
    id: "1",
    username: "foxxinews",
    name: "Foxxi News",
    image: Logo,
  };

  const fetchAllPosts = async () => {
    try {
      let tempData = [];
      const response = await axios.get(
        `https://api.newscatcherapi.com/v2/search?q=all`,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_NEWS_API_KEY,
          },
        }
      );
      console.log("News: ", response);
      response.data.articles.forEach((tweet, index) => {
        tempData.push({
          author: FoxxiOfficialUser,
          caption:
            tweet.title +
            "\n\n" +
            tweet.summary +
            "\n\n" +
            "To know more: " +
            tweet.link,
          media: {
            mediatype: "image",
            url: null,
          },
          createdAt: tweet.published_date,
          id: index,
          hashtags: [],
        });
      });
      setData(tempData);
    } catch (e) {
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
        message="Failed to fetch NewsFeed for you. Try reloading."
      />
    );
  }

  if (loading) {
    return <LoadingFallback />;
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
      <GradientBar color="indigo" />
      <div className="px-4 py-3">
        <div className="flex flex-col items-center justify-center">
          <HiCheckCircle className="w-10 h-10 mb-1 text-brand-500" />
          <p className="font-medium ">You&apos;re All Caught Up ! </p>
        </div>
      </div>
    </Card>
  );
}
