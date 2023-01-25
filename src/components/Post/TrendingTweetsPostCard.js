import clsx from "clsx";
import { format } from "date-fns";
import { Card } from "src/components/ui/Card";
import { TwitterTrendingInterweave } from "../TwitterTrendingInterweave";

import NextImage from "next/image";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";

export function TrendingTweetsPostCard(props) {
  if (!props.post || !props.post.author) {
    return <ErrorFallback message="Failed to load" />;
  }

  return (
    <>
      <Card noPadding className="max-w-2xl overflow-hidden my-3 rounded-lg ">
        <article>
          <div className="px-6 py-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={props.post.author.image}
                  alt={`Profile image of ${props.post.author.username}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium ">
                  {props.post.author.name}
                  <span className="text-muted text-sm ml-2">
                    @{props.post.author.username}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  <a className="hover:underline">
                    <time dateTime="2020-12-09T11:43:00">
                      {format(
                        new Date(props.post.createdAt),
                        "MMMM d, hh:mm aaa"
                      )}
                    </time>
                  </a>
                </p>
              </div>
            </div>
          </div>
          {/* Caption */}
          <div className="px-6  pb-2 my-2">
            <p className=" space-y-4 dark:text-gray-300">
              <TwitterTrendingInterweave content={props.post.caption} />
            </p>
            <p>
              {props.post.hashtags.map((hashtag, index) => {
                return (
                  <span
                    key={index}
                    className={clsx(
                      "bg-gray-50 dark:bg-gray-700 mr-2 shadow-sm border  dark:border-gray-500 border-gray-300 rounded-l-md rounded-r-md px-3 inline-flex items-center text-gray-500 dark:text-gray-100 sm:text-sm"
                    )}
                  >
                    {hashtag}
                  </span>
                );
              })}
            </p>
          </div>
          {/* GIF */}
          {props.post.gifLink && (
            <div className="mx-auto w-11/12 rounded-lg overflow-hidden">
              <img className="w-full" src={props.post.gifLink} alt="" />
            </div>
          )}
          {props.post.media.url && (
            <div className="mx-auto w-11/12 rounded-lg overflow-hidden ">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  disabled={true}
                  src={props.post.media.url}
                  // layout="fill"
                  // objectFit="cover"
                  placeholder="empty"
                  alt={`image posted by ${props.post.author.name} on Foxxi.`}
                />
              </div>
            </div>
          )}
        </article>
      </Card>
    </>
  );
}
