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
import axios from "axios";

export function News({ currentUser }) {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);

  const FoxxiOfficialUser = {
    id: "1",
    username: "foxxinews",
    name: "Foxxi News",
    image: "https://placekitten.com/200/300",
  };

  const fetchAllPosts = async () => {
    try {
      let tempData = [];
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=trending&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
      );
      console.log(response);
      response.data.articles.forEach((tweet) => {
        tempData.push({
          author: FoxxiOfficialUser,
          caption: tweet.title + "\n" + tweet.description + "\n" + tweet.url,
          media: {
            mediatype: "image",
            url: tweet.urlToImage,
          },
          // media: tweet.urlToImage,
          createdAt: tweet.publishedAt,
          id: tweet.source.id,
          hashtags: [],
        });
      });

      setData(tempData);
    } catch (e) {
      setError(true);
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
