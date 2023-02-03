import { HiCheckCircle } from "react-icons/hi";
import InfiniteScroll from "react-infinite-scroll-component";

import { Card } from "src/components/ui/Card";
import { GradientBar } from "src/components/ui/GradientBar";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import { FeedPostCard } from "../Post/FeedPostCard";
import { ErrorFallback } from "src/components/ui/Fallbacks/ErrorFallback";
import React, { useState, useEffect } from "react";
import { SEO } from "../SEO";
import { IndeterminateProgress } from "../ui/Progress";
import axios from "axios";
import { StoryBar } from "../Stories";
export function YourFeed({ currentUser }) {
  let fetchMore;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/preference`,
        {
          hashtags: currentUser.preferences,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      setData(response.data);
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
        message="Failed to fetch Feed for you. Try reloading."
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
        <StoryBar />
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
                        <FeedPostCard
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
      className="bg-white text-gray-900  max-w-2xl  dark:bg-gray-900 dark:text-gray-400 mt-2 overflow-hidden"
    >
      <GradientBar color="pink" />
      <div className="px-4 py-3">
        <div className="flex flex-col items-center justify-center">
          <HiCheckCircle className="w-10 h-10 mb-1 text-brand-500" />
          <p className="font-medium ">You&apos;re All Caught Up ! </p>
          <span className="text-center">
            Empty Feed? Follow people to see their posts.
          </span>
        </div>
      </div>
    </Card>
  );
}
