import InfiniteScroll from "react-infinite-scroll-component";

import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import Spinner from "src/components/ui/Spinner";

import { FollowButton } from "../FollowButton";
import { UserHandle } from "src/components/Common/UserHandle";
import { ErrorFallback } from "src/components/ui/Fallbacks/ErrorFallback";
import { SEO } from "src/components/SEO";
import Link from "next/link";
import Image from "next/image";

export function Following({ data, currentUser, username }) {
  // let loading, error, fetchMore;

  // if (loading) {
  //   return (
  //     <div className="py-6">
  //       <Spinner className="w-6 h-6" />
  //     </div>
  //   );
  // }

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
      <SEO title={`${username} / Following · Foxxi`} />
      <div>
        <div className="flow-root">
          <ul role="list" className=" divide-y  divide-gray-600">
            <InfiniteScroll
              dataLength={data.length}
              loader={<LoadingFallback />}
            >
              {data.map((edge) => {
                const user = edge;
                // !remove console.log(data);
                if (!user) return <h1>TODO : No user </h1>;
                return (
                  <li
                    key={user.id}
                    className="py-4 px-5 hover:bg-gray-100 dark:hover:bg-gray-900 hover:rounded-lg"
                  >
                    <div className="flex items-center space-x-4 ">
                      <div className="flex-shrink-0">
                        <Link href={`/profile/${user.username}`} passHref>
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.image}
                            width="40px"
                            height="40px"
                            alt="User Avatar"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {"@" + user.username}
                        </p>
                        <p className="text-sm truncate pt-1">
                          {user.bio ? user.bio : ""}
                        </p>
                      </div>
                      <div>
                        {!currentUser.annonymous ? (
                          <FollowButton
                            variant="dark"
                            isFollowing={user.followers?.includes(
                              currentUser?.id
                            )}
                            username={user.username}
                          />
                        ) : null}
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
