import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { EndMessage } from ".";
import { FeedPostCard } from "../Post/FeedPostCard";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";

export let POPULAR_POSTS;

export function PopularPostsFeed() {
  let data, error, fetchMore;

  if (error) {
    return (
      <ErrorFallback
        action={() => {}}
        message="Failed to fetch Feed for you. Try reloading."
      />
    );
  }
  if (!data) {
    return <LoadingFallback />;
  }

  function handleNext() {
    fetchMore({
      variables: {
        first: 10,
        after: data?.popularPosts.pageInfo.endCursor,
      },
    });
  }

  const length = data.popularPosts.edges.length;

  return (
    <main className="lg:col-span-7 xl:col-span-6 lg:grid lg:grid-cols-12 lg:gap-3">
      <div className="px-4 lg:col-span-12 -mt-3">
        <InfiniteScroll
          hasMore={data.popularPosts.pageInfo.hasNextPage}
          next={handleNext}
          dataLength={length}
          loader={<LoadingFallback />}
          endMessage={<EndMessage />}
        >
          {data.popularPosts.edges.map((edge) => {
            return <FeedPostCard post={edge?.node} key={edge?.cursor} />;
          })}
        </InfiniteScroll>
      </div>
    </main>
  );
}
