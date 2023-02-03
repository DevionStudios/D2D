import { Heading } from "../ui/Heading";
import { Card } from "src/components/ui/Card";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import { formatDistance } from "date-fns";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CommentDropdown } from "./CommentDropdown";
import { Interweave } from "../Interweave";
import { Badge } from "../ui/Badge";
import { Link } from "../ui/Link";

export function Comments({ comments, postId, currentUser }) {
  let error,
    fetchMore = false;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (comments) setData(comments);
  }, [comments]);

  if (error) {
    return (
      <ErrorFallback
        icon={
          <HiOutlineExclamationCircle className="h-12 w-12 text-gray-500" />
        }
        noAction
        message="Failed to load comments for this post."
      />
    );
  }

  return (
    <Card className="rounded-lg mb-2 bg-gray-25 dark:bg-black">
      <div className="relative">
        <div className="flow-root h-full ">
          <div className="py-3 px-4 border-b dark:border-gray-600 border-gray-200">
            <Heading size="h5">Comments ({data?.length || "0"})</Heading>
          </div>

          {data?.length == 0 ? (
            <div className="px-4 py-5 sm:p-6 flex items-start justify-center">
              <h1 className="text-muted font-medium text-center">
                There are no comments on this post. <br /> Be the first one to
                comment
              </h1>
            </div>
          ) : (
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-600 mb-2"
            >
              <InfiniteScroll
                dataLength={data?.length}
                loader={<LoadingFallback />}
              >
                {data?.map((edge, index) => (
                  <li
                    key={index}
                    className="py-4 px-4 border-b border-gray-300 dark:border-gray-700"
                    id={edge?.id}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={edge?.author?.image}
                          alt=""
                        />
                      </div>
                      <div className=" flex w-full justify-between">
                        <Link
                          className="no-underline"
                          href={`/profile/${edge?.author?.username}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex space-x-1">
                              <p className="text-sm font-medium  truncate">
                                {edge?.author?.name}
                              </p>
                              {edge?.author?.id === currentUser?.id ? (
                                <Badge size="sm" variant="pink">
                                  You
                                </Badge>
                              ) : null}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {"@" + edge?.author?.username}
                            </p>
                          </div>
                        </Link>
                        <div className="flex space-x-3 ">
                          <time className="flex-shrink-0 flex-1 whitespace-nowrap text-xs text-gray-500">
                            {formatDistance(
                              new Date(edge?.createdAt),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </time>

                          <div>
                            {edge?.author?.username ===
                            currentUser?.username ? (
                              <CommentDropdown
                                caption={edge?.caption}
                                id={edge?.id}
                                isMine={
                                  edge?.author?.username ===
                                  currentUser?.username
                                }
                                postId={postId}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm dark:text-gray-300 ">
                        <Interweave content={edge?.caption} />
                      </p>
                    </div>
                  </li>
                ))}
              </InfiniteScroll>
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}
