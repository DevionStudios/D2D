import { ConnectButton } from "@web3uikit/web3";
import { HiOutlineCubeTransparent } from "react-icons/hi";
import { FollowButton } from "src/components/Profile/FollowButton";
import { Button } from "src/components/ui/Button";
import { Card } from "src/components/ui/Card";
import { ErrorFallback } from "src/components/ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import { GradientBar } from "src/components/ui/GradientBar";
import { Heading } from "src/components/ui/Heading";
import { Link } from "src/components/ui/Link";
import { Footer } from "../Footer";
import { useState, useEffect } from "react";
import axios from "axios";
export let WHO_TO_FOLLOW_QUERYisFollowing;

export function RightSidebar({ currentUser }) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const getSuggestedUsers = async () => {
    setLoading(true);
    try {
      setError(false);
      const response = await axios.get(
        "${process.env.NEXT_PUBLIC_BASE_URL}/api/users/active",
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      const usersData = response.data;
      for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].id === currentUser.id) usersData.splice(i, 1);
      }
      console.log(usersData);
      setSuggestedUsers(usersData);
    } catch (e) {
      setError(true);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSuggestedUsers();
  }, []);
  if (error) {
    return (
      <aside className="w-full sticky top-20">
        <ErrorFallback
          message="Failed to load suggestions."
          action={() => getSuggestedUsers()}
          buttonText="Retry"
        />
      </aside>
    );
  }

  if (loading || !suggestedUsers) return <LoadingFallback />;

  if (suggestedUsers.length === 0) {
    return (
      <>
        <Card rounded="lg" className="sticky top-20">
          <ErrorFallback
            message="No user suggestions for now. :)"
            noAction
            icon={
              <HiOutlineCubeTransparent className="h-12 w-12 text-gray-500" />
            }
          />
        </Card>
        <Footer />
      </>
    );
  }

  return (
    <aside className="w-full sticky top-20 overflow-hidden">
      <div className=" space-y-4">
        <section aria-labelledby="who-to-follow-heading">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
            <GradientBar color="indigo" />
            <div className="p-6">
              <Heading size="h5">Who to follow</Heading>
              <div className="mt-6 flow-root">
                <ul
                  role="list"
                  className="-my-4 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {suggestedUsers.map((data) => {
                    const user = data;
                    return (
                      <li
                        key={user?.id}
                        className="flex items-center py-4 space-x-3"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={user?.image}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            <Link
                              className="no-underline"
                              href={`/profile/${user?.username}`}
                            >
                              {user?.name + " "}
                              {/* {user?.lastName ? user?.lastName : null} */}
                            </Link>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <a href={user?.username}>@{user?.username}</a>
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <FollowButton
                            variant="dark"
                            isFollowing={user?.followers?.includes(
                              currentUser.id
                            )}
                            username={user?.username}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <ConnectButton /> */}
      <Footer />
    </aside>
  );
}
