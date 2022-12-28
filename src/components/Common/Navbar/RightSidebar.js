import { HiOutlineCubeTransparent } from "react-icons/hi";
import { FollowButton } from "~/components/Profile/FollowButton";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { ErrorFallback } from "~/components/ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "~/components/ui/Fallbacks/LoadingFallback";
import { GradientBar } from "~/components/ui/GradientBar";
import { Heading } from "~/components/ui/Heading";
import { Link } from "~/components/ui/Link";
import { Footer } from "../Footer";

export let WHO_TO_FOLLOW_QUERYisFollowing;

export function RightSidebar() {
  let loading, error, refetch;
  let data = {
    whoToFollow: {
      edges: [
        {
          node: {
            id: "1",
            username: "neko_chan",
            avatar: "https://placekitten.com/200/300",
            firstName: "Neko",
            lastName: "Chan",
            isFollowing: false,
          },
        },
        {
          node: {
            id: "1",
            username: "inu_chan",
            avatar: "https://placekitten.com/400/300",
            firstName: "Inu",
            lastName: "Chan",
            isFollowing: true,
          },
        },
        {
          node: {
            id: "1",
            username: "saru_chan",
            avatar: "https://placekitten.com/300/300",
            firstName: "Saru",
            lastName: "Chan",
            isFollowing: false,
          },
        },
        {
          node: {
            id: "1",
            username: "hebi_chan",
            avatar: "https://placekitten.com/200/200",
            firstName: "Hebi",
            lastName: "Chan",
            isFollowing: false,
          },
        },
      ],
    },
  };

  if (error) {
    return (
      <aside className="w-full sticky top-20">
        <ErrorFallback
          message="Failed to load suggestions."
          action={() =>
            refetch({
              after: null,
              first: 5,
            })
          }
          buttonText="Retry"
        />
      </aside>
    );
  }

  if (loading || !data) return <LoadingFallback />;

  if (data.whoToFollow.edges.length === 0) {
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
                  {data.whoToFollow.edges.map((edge) => {
                    const user = edge?.node;
                    return (
                      <li
                        key={user?.id}
                        className="flex items-center py-4 space-x-3"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={user?.avatar}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            <Link
                              className="no-underline"
                              href={`/profile/${user?.username}`}
                            >
                              {user?.firstName + " "}
                              {user?.lastName ? user?.lastName : null}
                            </Link>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <a href={user?.username}>@{user?.username}</a>
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <FollowButton
                            variant="dark"
                            isFollowing={user?.isFollowing}
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
      <Footer />
    </aside>
  );
}
