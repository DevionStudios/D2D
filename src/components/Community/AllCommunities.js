import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { Heading } from "../ui/Heading";
import { useEffect, useState } from "react";
import { JoinButton } from "./JoinButton";
import Link from "next/link";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
export function AllCommunities({ currentUser, isDiscover }) {
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);

  const [communities, setCommunities] = useState([]);

  const router = useRouter();
  if (!communities)
    return (
      <ErrorFallback
        action={() => router.reload()}
        message={`Failed to load search result.`}
        buttonText="Try again."
      />
    );

  const fetchSuggestedCommunities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/discover?limit=10&skip=${skip}`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      if (response.data?.communities?.length > 0)
        setCommunities([...communities, ...response.data?.communities]);
      else setHasMoreData(false);
      setSkip(skip + 5);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedCommunities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/joined?limit=5`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      if (response.data?.communities?.length > 0)
        setCommunities([...communities, ...response.data?.communities]);
      else setHasMoreData(false);
      setSkip(skip + 5);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (isDiscover) {
      await fetchSuggestedCommunities();
    } else {
      await fetchJoinedCommunities();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="dark:bg-gray-900 " style={{ marginTop: "100px" }}>
      <div className="flow-root mt-2 px-4 dark:bg-gray-900">
        <ul role="list" className=" divide-y divide-gray-200">
          <InfiniteScroll
            next={fetchData}
            dataLength={communities?.length}
            loader={<LoadingFallback />}
            hasMore={hasMoreData}
            endMessage={() => {
              return <div>You Have Reached The End!</div>;
            }}
          >
            {communities.length > 0 ? (
              communities.map((edge) => {
                const community = edge;
                if (community) {
                  return (
                    <li key={community.id} className="py-4 mx-6">
                      <div className="flex items-center justify-evenly space-x-4">
                        <Link
                          href={`/community/${community?.name}`}
                          passHref={true}
                        >
                          <div>
                            <div className="flex-shrink-0">
                              <img
                                className="h-20 w-20 rounded-full"
                                src={
                                  community.avatar?.length > 0
                                    ? community.avatar
                                    : "/assets/community.jpg"
                                }
                                alt="Community Image"
                              />
                            </div>
                            <div className="pt-2 flex-1 min-w-0 text-center">
                              <p className="text-md font-medium truncate">
                                {community.publicName}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {"@" + community.name}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div>
                          <JoinButton
                            currentUser={currentUser}
                            isJoined={() => {
                              return currentUser?.joinedCommunities?.includes(
                                community?.id
                              );
                            }}
                            communityName={community?.name}
                            size="lg"
                          />
                        </div>
                      </div>
                    </li>
                  );
                }
              })
            ) : (
              <ErrorFallback
                action={() => router.back()}
                message={`You have not messaged anyone yet.`}
                buttonText="Go back"
              />
            )}
          </InfiniteScroll>
        </ul>
      </div>
    </div>
  );
}
