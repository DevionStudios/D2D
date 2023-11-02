import clsx from "clsx";
import { Card } from "../ui/Card";
import { Tab } from "@headlessui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

import { EndMessage } from "../Feed";
import { Badge } from "../ui/Badge";
import { FeedPostCard } from "../Post/FeedPostCard";
import { StoryCard } from "../Post/StoryCard";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import { CommunityPostCard } from "./CommunityPostCard";
import { CommunityDetails } from "./CommunityDetails";
import toast from "react-hot-toast";
import axios from "axios";
export function CommunityPosts({
  communityname,
  currentUser,
  communityRules,
  isNSFWAllowed,
  createdAt,
  memberCount,
}) {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMorePost, setHasMorePost] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const fetchPosts = async () => {
    // fetch posts from community
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/posts/${communityname}?skip=${skip}`
      );
      console.log(response.data);
      if (response.data?.communityPosts?.length > 0)
        setPosts([...posts, ...response.data?.communityPosts]);
      else setHasMorePost(false);
      setSkip(skip + limit);
    } catch (e) {
      toast.error("Failed to fetch posts.");
    }
  };
  return (
    <Tab.Group>
      <Card.Body
        className="mt-5 max-w-2xl   z-10 top-16  bg-white dark:bg-gray-800 rounded-md overflow-hidden"
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
              Posts
              {/* <Badge variant="pink"> {count}</Badge> */}
            </p>
          </Tab>
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
              Details
              {/* <Badge variant="pink"> {count}</Badge> */}
            </p>
          </Tab>
        </Tab.List>
      </Card.Body>
      <Tab.Panels>
        <Tab.Panel className="max-w-2xl">
          <main className="lg:col-span-7 xl:col-span-6 lg:grid lg:grid-cols-12 lg:gap-3">
            <div className=" lg:col-span-12 ">
              <InfiniteScroll
                next={fetchPosts}
                dataLength={posts?.length}
                loader={<LoadingFallback />}
                hasMore={hasMorePost}
                endMessage={<EndMessage />}
              >
                {posts.map((post) => {
                  const data = post;
                  if (data) {
                    return (
                      <div key={post.id}>
                        <CommunityPostCard
                          post={post}
                          currentUser={currentUser}
                        />
                      </div>
                    );
                  }
                })}
              </InfiniteScroll>
            </div>
          </main>
        </Tab.Panel>
        <Tab.Panel className="max-w-2xl">
          <main className="lg:col-span-7 xl:col-span-6 lg:grid lg:grid-cols-12 lg:gap-3">
            <CommunityDetails
              communityRules={communityRules}
              isNSFWAllowed={isNSFWAllowed}
              createdAt={createdAt}
              memberCount={memberCount}
            />
          </main>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
