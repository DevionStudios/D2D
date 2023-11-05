import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  HiHeart,
  HiOutlineCurrencyDollar,
  HiOutlineHeart,
  HiOutlineReply,
  HiOutlineShare,
} from "react-icons/hi";
import { BiRepost } from "react-icons/bi";

import { format } from "date-fns";

import { DonateModal } from "./DonateModal";
import { Card } from "src/components/ui/Card";
import { Interweave } from "../Interweave";
import { ReplyModal } from "./ReplyModal";
import { Button } from "../ui/Button";
import { Link } from "src/components/ui/Link";
import { PostDropdown } from "./PostDropdown";
import NextImage from "next/image";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import toast from "react-hot-toast";
import axios from "axios";

export function FeedPostCard(props) {
  const [imageModal, setImageModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [post, setPost] = useState(props.post);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const [likes, setLikes] = useState(props.post?.likes?.length);
  const [comments, setComments] = useState(props.post?.comments?.length);
  const [reposts, setReposts] = useState(props.post?.reposts);
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    let hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
      } else if ("orientation" in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }
    if (hasTouchScreen) {
      setDeviceType("Mobile");
    } else {
      setDeviceType("Desktop");
    }
  }, []);

  let loading;
  useEffect(() => {
    setIsLiked(checkLiked());
    setPost(props.post);

    setLikes(props.post?.likes?.length);
    setComments(props.post?.comments?.length);
  }, [props.post]);

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

      if (response.status === 200) {
        if (isLiked) setLikes(likes - 1);
        else setLikes(likes + 1);
        setIsLiked(!isLiked);
        setPost({
          ...post,
          likes: response.data.likes,
        });
        if (!isLiked) {
          const notification = ` liked your `;
          const response2 = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/create`,
            {
              notification: notification,
              userId: props.post.author?.id,
              notificationType: "POST_LIKE",
              username: props.currentUser?.username,
              postId: props.post?.id,
            },
            {
              headers: {
                cookies: document.cookie,
              },
            }
          );
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }
  };

  const checkLiked = () => {
    if (!props.post.likes) return false;

    return props.post.likes.includes(props.currentUser.id);
  };

  const repost = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reposts/create`,
        {
          postId: props.post.id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );

      if (response.status === 201) {
        setReposts(reposts + 1);
        toast.success("Reposted!", {
          icon: "🎉",
        });
      } else {
        toast.error(response.data.message || "Oops...Failed to repost", {
          icon: "❌",
        });
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Oops...Failed to repost", {
        icon: "❌",
      });
    }
  };

  return (
    <>
      <ReplyModal
        isOpen={isOpen}
        comments={comments}
        setComments={setComments}
        onClose={() => setIsOpen(false)}
        {...props}
      />
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        receiverWalletAddress={props.post.author.walletAddress}
        {...props}
      />
      <Card
        noPadding
        className="max-w-2xl bg-gray-25 dark:bg-black overflow-hidden my-3 rounded-lg "
      >
        <article>
          <div className="px-6 py-4">
            <div className="flex space-x-3">
              <Link
                href={`/stories/${props.post.author.username}`}
                className="no-underline"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={props.post.author.image}
                    alt={`Profile image of ${props.post.author.username}`}
                  />
                </div>
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/profile/${props.post.author.username}`}
                  className="no-underline"
                >
                  <p className="text-sm font-medium usernametext">
                    {props.post.author.name}
                    <span className="text-muted text-sm ml-2 usernametext">
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
                {/* {props?.post?.communityId ? (
                  <p className="text-sm text-gray-500">
                    <a
                      href={`/community/${props?.post?.communityId?.name}`}
                      className="hover:underline"
                    >
                      From {props?.post?.communityId}
                    </a>
                  </p>
                ) : null} */}
              </div>
              <div className="flex-shrink-0 self-center flex">
                {props.currentUser.annonymous ? null : (
                  <PostDropdown
                    id={props.post.id}
                    isMine={props.post.author.username === props.username}
                    caption={props.post.caption ?? ""}
                    gifLink={props.post.gifLink ?? ""}
                    currentUser={props.currentUser}
                    post={props.post}
                    deviceType={deviceType}
                    repost={repost}
                  />
                )}
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
          <Link
            href={`/post/${props.post.id}`}
            className="mt-1 block no-underline font-normal outline-none focus:outline-none focus:ring-0"
          >
            {props.post.gifLink && (
              <div className="mx-auto w-11/12 rounded-lg overflow-hidden">
                <img className="w-full" src={props.post.gifLink} alt="" />
              </div>
            )}

            {props.post.media.url && (
              <div className="aspect-w-3 aspect-h-2 h-auto ">
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
                    onClick={() => setImageModal(true)}
                    src={props.post.media?.url || props.post.media}
                    layout="fill"
                    objectFit="contain"
                    placeholder="empty"
                    className="!w-full"
                  />
                )}
              </div>
            )}
          </Link>
          {/* Post Actions */}
          <div className="py-2 px-6 bg-gray-200 dark:bg-gray-900/70 flex border-t border-gray-200 dark:border-gray-700 justify-between space-x-8">
            <div className="flex space-x-6">
              {!props.currentUser.annonymous ? (
                <>
                  <span className="inline-flex items-center space-x-2  ">
                    <Button
                      loading={loading}
                      variant="dark"
                      onClick={async () => {
                        await toggleLike({ variables: { id: props.post.id } });
                      }}
                      className="rounded-full overflow-hidden space-x-2"
                    >
                      {isLiked ? (
                        <HiHeart className="w-5 h-5 text-red-700" />
                      ) : (
                        <HiOutlineHeart className="w-5 h-5" />
                      )}
                      <p>{likes || "0"}</p>
                    </Button>
                  </span>
                  <span className="inline-flex items-center space-x-2">
                    <Button
                      variant="dark"
                      onClick={() => setIsOpen(true)}
                      className="space-x-2"
                    >
                      <HiOutlineReply className="w-5 h-5" />
                      <p>{comments || "0"}</p>
                    </Button>
                  </span>
                  {deviceType !== "Mobile" && (
                    <span className="inline-flex items-center space-x-2">
                      <Button
                        variant="dark"
                        onClick={() => repost()}
                        className="space-x-2"
                      >
                        <BiRepost className="w-5 h-5" />
                        <p>{reposts || "0"}</p>
                      </Button>
                    </span>
                  )}
                </>
              ) : null}
              {/* To Tip on the posts */}
              <span className="inline-flex items-center space-x-2">
                <Button
                  variant="dark"
                  className="space-x-2"
                  onClick={() => {
                    setIsDonateModalOpen(true);
                  }}
                >
                  <HiOutlineCurrencyDollar className="w-10 h-6" />
                </Button>
              </span>
            </div>
            <div>
              {/* <span className="inline-flex items-center space-x-2  ">
                <Button
                  variant="dark"
                  onClick={async () => {
                    navigator.clipboard
                      .writeText(
                        `https://foxxi-frontend.vercel.app/post/${props.post.id}`
                      )
                      .then(() => toast.success("Link copied to clipboard"));
                  }}
                >
                  <HiOutlineShare className="w-6 h-6 " />
                </Button>
              </span> */}
            </div>
          </div>
        </article>
      </Card>
    </>
  );
}
