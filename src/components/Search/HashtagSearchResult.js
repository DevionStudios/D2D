import { useRouter } from "next/router";
import { FeedPostCard } from "../Post/FeedPostCard";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { Heading } from "../ui/Heading";

export function HashtagSearchResult({ data, currentUser, loading }) {
  const router = useRouter();

  if (!data)
    return (
      <ErrorFallback
        action={() => router.reload()}
        message={`Failed to load search result.`}
        buttonText="Try again."
      />
    );

  const posts = data;

  return (
    <div className="dark:bg-black">
      <Heading size="h4" className="py-4 px-4 ">
        Posts tagged #{router.query.query}
      </Heading>

      {loading ? (
        <>
          <LoadingFallback />
        </>
      ) : (
        <>
          {posts.length > 0 ? (
            posts.map((edge) => {
              const data = edge;
              if (data) {
                return (
                  <FeedPostCard
                    key={data.id}
                    post={data}
                    currentUser={currentUser}
                  />
                );
              }
            })
          ) : (
            <ErrorFallback
              action={() => router.back()}
              message={`No posts tagged with #${router.query.query}`}
              buttonText="Go back."
            />
          )}{" "}
        </>
      )}
    </div>
  );
}
