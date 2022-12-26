import Spinner from "~/components/ui/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingFallback } from "~/components/ui/Fallbacks/LoadingFallback";
import { FollowButton } from "../FollowButton";
import { UserHandle } from "~/components/Common/UserHandle";
import { ErrorFallback } from "~/components/ui/Fallbacks/ErrorFallback";
import { SEO } from "~/components/SEO";

let FOLLOWERS_LIST_QUERY;

export function Followers({ username }) {
  let data, loading, error, fetchMore;

  if (error) return <ErrorFallback message="Something went wrong." />;

  if (loading) {
    return (
      <div className="py-6">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }
  if (!data || data.seeProfile.followers.edges.length === 0)
    return (
      <div className="px-4 py-5 sm:p-6 flex items-start justify-center">
        <h1 className="text-muted font-medium text-center">
          There are no users {username} are followed by.
        </h1>
      </div>
    );

  return (
    <>
      <SEO title={`${username} / Followers · D2D`} />
      <div>
        <div className="flow-root">
          <ul role="list" className=" divide-y  divide-gray-600">
            <InfiniteScroll
              hasMore={data.seeProfile.followers.pageInfo.hasNextPage}
              next={() => {
                console.log("called");
                fetchMore({
                  variables: {
                    first: 10,
                    after: data.seeProfile.followers.pageInfo.endCursor,
                    username,
                  },
                });
              }}
              dataLength={data.seeProfile.followers.edges.length}
              loader={<LoadingFallback />}
            >
              {data.seeProfile.followers.edges.map((edge) => {
                const user = edge?.node;
                if (!user) return <h1>TODO : No user </h1>;
                return (
                  <li
                    key={edge.cursor}
                    className="py-4 px-5 hover:bg-gray-100 dark:hover:bg-gray-900 hover:rounded-lg"
                  >
                    <div className="flex items-center space-x-4 ">
                      <UserHandle user={user} />
                      <div>
                        {user.isMe ? null : (
                          <FollowButton
                            isFollowing={user.isFollowing}
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
