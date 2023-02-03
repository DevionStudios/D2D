import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { UserHandle } from "../Common/UserHandle";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

let LIKED_BY_QUERY;

export function ViewLikes({ isOpen, onClose }) {
  const router = useRouter();

  let loadLikedBy, data, loading, error, fetchMore;

  useEffect(() => {
    if (isOpen) {
      loadLikedBy();
    }
  }, [isOpen]);

  if (error)
    return <ErrorFallback noAction message="Failed to load liked by list." />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[90vh] overflow-y-scroll"
    >
      <Modal.Header dismiss>
        <Heading size="h4">Liked by</Heading>
      </Modal.Header>

      {loading || !data ? (
        <Spinner className="w-8 h-8" />
      ) : (
        <ul role="list" className=" divide-y  divide-gray-600">
          {data.seePost.likes.edges.length > 0 ? (
            <InfiniteScroll
              hasMore={data.seePost.likes.pageInfo.hasNextPage}
              next={() => {
                if (!fetchMore) {
                  loadLikedBy({
                    variables: {
                      first: 10,
                      id: router.query.id,
                      after: null,
                    },
                  });
                } else {
                  fetchMore({
                    variables: {
                      first: 3,
                      after: data.seePost.likes.pageInfo.endCursor,
                    },
                  });
                }
              }}
              dataLength={data.seePost.likes.edges.length}
              loader={<LoadingFallback />}
            >
              {data.seePost.likes.edges.map((u) => {
                const user = u?.node.user;
                return (
                  <li
                    key={u?.cursor}
                    className="py-4 px-5 hover:bg-gray-100 dark:hover:bg-gray-900 hover:rounded-lg"
                  >
                    <div className="flex items-center space-x-4 ">
                      <UserHandle user={user} />
                    </div>
                  </li>
                );
              })}
            </InfiniteScroll>
          ) : (
            <ErrorFallback
              message="There are no likes on this post."
              noAction
            />
          )}
        </ul>
      )}
    </Modal>
  );
}
