import Spinner from "src/components/ui/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import { FollowButton } from "../FollowButton";
import { UserHandle } from "src/components/Common/UserHandle";
import { ErrorFallback } from "src/components/ui/Fallbacks/ErrorFallback";
import { SEO } from "src/components/SEO";

export function Followers({ currentUser, data, username }) {
  let loading, error, fetchMore;

  if (error) return <ErrorFallback message="Something went wrong." />;

  if (loading) {
    return (
      <div className="py-6">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }
  if (!data || data.length === 0)
    return (
      <div className="px-4 py-5 sm:p-6 flex items-start justify-center">
        <h1 className="text-muted font-medium text-center">
          There are no users {username} are followed by.
        </h1>
      </div>
    );

  return (
    <>
      <SEO title={`${username} / Followers · Foxxi`} />
      <div>
        <div className="flow-root">
          <ul role="list" className=" divide-y  divide-gray-600">
            <InfiniteScroll
              dataLength={data.length}
              loader={<LoadingFallback />}
            >
              {data.map((edge) => {
                const user = edge;
                if (!user) return <h1>TODO : No user </h1>;
                return (
                  <li
                    key={user.id}
                    className="py-4 px-5 hover:bg-gray-100 dark:hover:bg-gray-900 hover:rounded-lg"
                  >
                    <div className="flex items-center space-x-4 ">
                      <UserHandle user={user} />
                      <div>
                        {user.isMe ? null : (
                          <FollowButton
                            isFollowing={user.followers.includes(
                              currentUser.id
                            )}
                            username={user.username}
                            variant="dark"
                          />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </InfiniteScroll>
          </ul>
        </div>
      </div>
    </>
  );
}
