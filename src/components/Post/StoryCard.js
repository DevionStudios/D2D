import { format } from "date-fns";

import { Card } from "src/components/ui/Card";
import { Interweave } from "../Interweave";
import { Link } from "src/components/ui/Link";
import { PostDropdown } from "./PostDropdown";
import NextImage from "next/image";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import toast from "react-hot-toast";
import axios from "axios";

export function StoryCard(props) {
  let loading;

  if (!props.post || !props.post.author) {
    return <ErrorFallback message="Failed to load" />;
  }

  const toggleLike = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/like`,
        {
          id: props.post.id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }
  };

  const checkLiked = () => {
    if (!props.post.likes) return false;

    return props.post.likes.includes(props.currentUser.id);
  };

  return (
    <>
      <Card
        noPadding
        className="max-w-2xl bg-gray-100 dark:bg-black overflow-hidden my-3 rounded-lg "
      >
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
                <Link
                  href={`/profile/${props.post.author.username}`}
                  className="no-underline"
                >
                  <p className="text-sm font-medium ">
                    {props.post.author.name}
                    <span className="text-muted text-sm ml-2">
                      @{props.post.author.username}
                    </span>
                  </p>
                </Link>
                <p className="text-sm text-gray-500">
                  <a href="#" className="hover:underline">
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
          <Link href={`/post/${props.post.id}`} className="no-underline">
            <div className="px-6  pb-2 my-2">
              <p className=" space-y-4 dark:text-gray-300">
                <Interweave content={props.post.caption} />
              </p>
            </div>
          </Link>
          {/* GIF */}

          {props.post?.media?.url && (
            <div className="mx-auto w-11/12 rounded-lg overflow-hidden ">
              {props.post.media.url && (
                <div className="aspect-w-1 aspect-h-1 ">
                  {props.post.media &&
                  props.post.media.url &&
                  props.post.media.mediatype === "video" ? (
                    <video placeholder="empty" className="!w-full" controls>
                      <source src={props.post.media.url} type="video/mp4" />
                      <source src={props.post.media.url} type="video/mkv" />
                      <source src={props.post.media.url} type="video/m4v" />
                      <source src={props.post.media.url} type="video/webm" />
                    </video>
                  ) : (
                    <NextImage
                      src={props.post.media?.url || props.post.media}
                      layout="fill"
                      objectFit="cover"
                      placeholder="empty"
                      className="!w-full"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </article>
      </Card>
    </>
  );
}
