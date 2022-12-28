import { HiCheckCircle } from "react-icons/hi";
import InfiniteScroll from "react-infinite-scroll-component";

import { Card } from "~/components/ui/Card";
import { GradientBar } from "~/components/ui/GradientBar";
import { LoadingFallback } from "~/components/ui/Fallbacks/LoadingFallback";
import { FeedPostCard } from "../Post/FeedPostCard";
import { ErrorFallback } from "~/components/ui/Fallbacks/ErrorFallback";
import React from "react";
import { SEO } from "../SEO";
import { IndeterminateProgress } from "../ui/Progress";

let FEED_QUERY;

export function Feed() {
  let error, fetchMore;
  let data = {
    feed: {
      edges: [
        {
          node: {
            id: "1",
            title: "Hello World",
            content: "This is a test post",
            createdAt: "2020-12-09T11:43:00",
            user: {
              id: "1",
              username: "neko_chan",
              avatar: "https://placekitten.com/200/300",
              firstName: "Neko",
              lastName: "Chan",
            },
          },

          cursor: "1",
        },
        {
          node: {
            id: "2",
            title: "Hello World",
            content: "This is a test post",
            createAt: "2020-12-09T11:43:00",
            user: {
              id: "1",
              username: "neko_chan",
              avatar: "https://placekitten.com/200/300",
              firstName: "Neko",
              lastName: "Chan",
              isFollowing: false,
            },
          },
          cursor: "2",
        },
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: "2",
      },
    },
  };

  if (error) {
    return (
      <ErrorFallback
        action={() => {}}
        message="Failed to fetch Feed for you. Try reloading."
      />
    );
  }
  if (!data) {
    return <h1></h1>;
  }

  function handleNext() {
    fetchMore({
      variables: {
        first: 10,
        after: data?.feed.pageInfo.endCursor,
      },
    });
  }

  const length = data.feed.edges.length;

  return (
    <>
      <SEO
        title="Explore · D2D"
        description="Explore community posts and posts from people you follow."
      />
      <main className="lg:col-span-7 xl:col-span-6 lg:grid lg:grid-cols-12 lg:gap-3">
        <div className="px-4 lg:col-span-12 -mt-3">
          <InfiniteScroll
            hasMore={data.feed.pageInfo.hasNextPage}
            next={handleNext}
            dataLength={length}
            loader={<IndeterminateProgress />}
            endMessage={<EndMessage />}
          >
            {data.feed.edges.map((edge, index) => {
              return (
                <div key={edge?.cursor}>
                  <FeedPostCard post={edge?.node} />
                  {/* {index === 5 || index === 10 ? <WhoToFollow /> : null} */}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </main>
    </>
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
            Empty Feed? Follow people to see their posts.
          </span>
        </div>
      </div>
    </Card>
  );
}
