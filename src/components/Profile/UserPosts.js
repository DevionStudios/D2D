import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { Card } from "../ui/Card";

import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
// import { FeedPostCard } from "../Post/FeedPostCard";
import { Badge } from "../ui/Badge";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
// import { EndMessage } from "../Feed";

export function UserPosts({ username, count }) {
  //dummy data
  const posts = [];
  return (
    <Tab.Group>
      <Card.Body
        className="mt-5 max-w-2xl   z-10 sticky top-16  bg-white dark:bg-gray-800 rounded-md overflow-hidden"
        noPadding
      >
        <Tab.List
          className="-mb-px  border-b border-gray-600 "
          aria-label="Tabs"
        >
          <Tab
            className={({ selected }) =>
              clsx(
                selected
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-brand-700 hover:border-brand-700",
                "w-1/4 py-4 px-1 text-center border-b-2  font-medium text-sm flex-1"
              )
            }
          >
            <p className="text-base font-medium">
              Posts <Badge variant="pink"> {count}</Badge>
            </p>
          </Tab>
        </Tab.List>
      </Card.Body>
      <Tab.Panels>
        <Tab.Panel className="max-w-2xl">
          <main className="lg:col-span-7 xl:col-span-6 lg:grid lg:grid-cols-12 lg:gap-3">
            <div className=" lg:col-span-12 ">
              <InfiniteScroll
                // hasMore={data.seeProfile.posts.pageInfo.hasNextPage}
                next={() => {
                  //   fetchMore({
                  //     variables: {
                  //       first: 10,
                  //       after: data.seeProfile.posts.pageInfo.endCursor,
                  //       username,
                  //     },
                  //   });
                }}
                dataLength={posts.length}
                loader={<LoadingFallback />}
                // endMessage={<EndMessage />}
              >
                {posts.map((post) => {
                  const data = post;
                  if (data) {
                    return (
                      <div key={post.id}>
                        <FeedPostCard post={data} />
                      </div>
                    );
                  }
                })}
              </InfiniteScroll>
            </div>
          </main>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
