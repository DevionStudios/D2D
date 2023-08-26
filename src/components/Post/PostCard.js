import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { format, formatDistance } from "date-fns";
import toast from "react-hot-toast";
import clsx from "clsx";
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineReply,
  HiOutlineShare,
} from "react-icons/hi";
import { z } from "zod";
import NextImage from "next/image";

import { Interweave } from "../Interweave";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import Form, { useZodForm } from "../ui/Form/Form";
import { TextArea } from "../ui/TextArea";
import { PostDropdown } from "./PostDropdown";
import { Comments } from "../Comments/Comments";

import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import Modal from "../ui/Modal";
import { Link } from "src/components/ui/Link";

import { ViewLikes } from "./ViewLikes";
import { SEO } from "../SEO";

import axios from "axios";

export const CommentSchema = z.object({
  caption: z.string().min(1, "Comment must be atleast 1 character long."),
});

export function PostCard({ id, username, currentUser }) {
  const [imageModal, setImageModal] = useState(false);
  const [likesModal, setLikesModal] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  let error,
    isLikeLoading = false;

  const router = useRouter();
  const fetchPostData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${id}`
      );
      setData(res.data);
      setLikes(res.data?.likes.length);
      setComments(res.data?.comments);
      setIsLiked(res.data?.likes?.includes(currentUser.id));
    } catch (e) {
      // console.log(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchPostData();
  }, []);
  const form = useZodForm({
    schema: CommentSchema,
  });

  const toggleLike = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/like`,
        {
          id: id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      setLikes(response.data.likes.length);
      setIsLiked(!isLiked);
      if (!isLiked) {
        const notification = ` liked your `;
        const response2 = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/create`,
          {
            notification: notification,
            userId: data.author?.id,
            notificationType: "POST_LIKE",
            username: currentUser?.username,
            postId: data.id,
          },
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
        console.log(response2.data);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const createComment = async (values) => {
    const caption = values.variables.input.caption;
    caption.replace(/(?<=@).*?(?=( |$))/g, async (mention) => {
      console.log("Mention: ", mention);

      // create notification of every mention
      const notificationResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/create`,
        {
          notification: ` mentioned you `,
          userId: data.author?.id,
          notificationType: "MENTION",
          username: mention,
          postId: data.id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/create`,
        {
          caption: values.variables.input.caption,
          postId: id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      const notification = ` replied to your `;
      const response2 = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/create`,
        {
          notification: notification,
          userId: data.author?.id,
          notificationType: "POST_REPLY",
          username: currentUser?.username,
          postId: data.id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );

      window.location.reload();
      setComments(response.data.comments);
      toast.success("Your comment has been posted.");
      form.reset();
    } catch (error) {
      // console.log(error);
    }
  };

  if (loading) return <LoadingFallback />;
  if (error)
    return (
      <ErrorFallback
        action={() => window.location.reload()}
        message="Failed to load post for you. It may be deleted or unavailable at this point."
      />
    );

  if (!data)
    return (
      <ErrorFallback
        action={() => window.location.reload()}
        message="Failed to load post. Please try reloading"
      />
    );

  return data && data.author ? (
    <>
      <SEO
        title={`${data.author.username} on Foxxi: ${
          data.caption ? data.caption.slice(0, 255) : ""
        }`}
        description={data.caption ? data.caption.slice(0, 255) : ""}
        image={data.author.image}
        path={`/post/${data.id}`}
      />
      <div className="max-w-2xl mx-auto flex flex-wrap space-y-4 relative">
        <div className="absolute -left-24 top-5">
          <Button variant="dark" onClick={() => router.push("/feed")}>
            ← Back
          </Button>
        </div>
        <div className="w-full md:pb-0">
          <div>
            <Card className="rounded-t-lg bg-gray-25 dark:bg-black ">
              <div className="px-4 py-4  sm:p-4 sm:rounded-lg">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={data.author.image}
                      alt=""
                    />
                  </div>
                  <div className="min-w-0 flex-1 usernametext">
                    <p className=" font-medium ">
                      <Link
                        href={`/profile/${data.author.username}`}
                        className="no-underline"
                      >
                        {data.author.name}
                        <span className="text-muted ml-1 text-sm">
                          @{data.author.username}
                        </span>
                      </Link>
                    </p>
                    <p className="text-sm text-muted">
                      <a href="#" className="hover:underline">
                        <time>
                          {format(
                            new Date(data.createdAt),
                            "MMMM d, hh:mm aaa"
                          )}{" "}
                          (
                          {formatDistance(
                            new Date(data.createdAt),
                            new Date(),
                            {
                              addSuffix: true,
                            }
                          )}
                          )
                        </time>
                      </a>
                    </p>
                  </div>
                  <div className="flex-shrink-0 self-center flex">
                    {!currentUser.annonymous ? (
                      username === data.author.username ? (
                        <PostDropdown
                          id={data.id}
                          isMine={username === data.author.username}
                          caption={data.caption ?? ""}
                          gifLink={data.gifLink ?? ""}
                          post={data}
                        />
                      ) : null
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <Interweave content={data.caption} />
              </div>
              {data.gifLink && (
                <div className="mx-auto w-11/12 rounded-lg pb-4 overflow-hidden">
                  <img
                    className="w-full rounded-lg"
                    src={data.gifLink}
                    alt={`A moving GIF image posted by ${data.author.username}.`}
                  />
                </div>
              )}
              {data.media.url && (
                <div className="aspect-w-1 aspect-h-1 ">
                  {data.media &&
                  data.media.url &&
                  data.media.mediatype === "video" ? (
                    <video placeholder="empty" className="!w-full" controls>
                      <source src={data.media.url} type="video/mp4" />
                      <source src={data.media.url} type="video/mkv" />
                      <source src={data.media.url} type="video/m4v" />
                      <source src={data.media.url} type="video/webm" />
                    </video>
                  ) : (
                    <NextImage
                      onClick={() => setImageModal(true)}
                      src={data.media?.url || data.media}
                      layout="fill"
                      objectFit="cover"
                      placeholder="empty"
                      className="!w-full"
                    />
                  )}
                </div>
              )}
              <Modal
                className="sm:max-w-7xl p-0 m-0"
                isOpen={imageModal}
                onClose={() => setImageModal(false)}
              >
                <Modal.Content>
                  <div
                    style={{
                      height: "80vh",
                      width: "100%",
                    }}
                  >
                    <NextImage
                      layout="fill"
                      objectFit="contain"
                      src={data.media}
                    />
                  </div>
                </Modal.Content>
                {/* hack for focusable element */}
                <Button
                  variant="dark"
                  className="absolute inset-x-auto top-4 "
                  onClick={() => setImageModal(false)}
                >
                  Close
                </Button>
              </Modal>
            </Card>

            {!currentUser.annonymous ? (
              <Card className="py-2 px-4 flex justify-between space-x-8 bg-gray-25 dark:bg-black">
                <div className="flex space-x-6">
                  <span className="inline-flex">
                    <p className="font-bold">{likes || "0"}</p>
                    <button onClick={() => setLikesModal(true)}>
                      <p className="text-muted ml-1 ">Likes</p>{" "}
                    </button>
                    <ViewLikes
                      isOpen={likesModal}
                      onClose={() => setLikesModal(false)}
                    />
                  </span>
                  <span className="inline-flex">
                    <p className="font-bold">{comments?.length || "0"}</p>
                    <p className="text-muted ml-1 ">Comments</p>{" "}
                  </span>
                </div>
              </Card>
            ) : null}

            {!currentUser.annonymous ? (
              <Card className="py-4 px-4 flex justify-between space-x-8 rounded-b-lg bg-gray-30 dark:bg-black">
                <div className="flex space-x-6">
                  <span className="inline-flex items-center text-sm">
                    <Button
                      loading={isLikeLoading}
                      onClick={async () => {
                        await toggleLike({
                          variables: { id: data.id },
                        });
                      }}
                      variant="dark"
                    >
                      {isLiked ? (
                        <HiHeart
                          className="h-5 w-5 text-brand-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <HiOutlineHeart
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                      <span className="ml-1">Like</span>
                      <span className="sr-only">likes</span>{" "}
                    </Button>
                  </span>
                </div>
                <div className="flex text-sm">
                  <span className="inline-flex items-center text-sm">
                    <Button
                      variant="dark"
                      onClick={async () => {
                        navigator.clipboard
                          .writeText(`https://foxxi.social/post/${data.id}`)
                          .then(() =>
                            toast.success("Link copied to clipboard")
                          );
                      }}
                    >
                      <span>
                        <HiOutlineShare
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="font-medium ml-1">Share</span>
                      <span className="sr-only">Share</span>
                    </Button>
                  </span>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
        {!currentUser.annonymous ? (
          <Card
            className="w-full bg-gray-25 dark:bg-black"
            rounded="lg"
            style={{}}
          >
            <Card.Body>
              <Form
                form={form}
                onSubmit={async (values) => {
                  await createComment({
                    variables: {
                      input: {
                        caption: values.caption,
                      },
                    },
                  });
                }}
              >
                <TextArea
                  label="Your reply"
                  {...form.register("caption")}
                  placeholder="An interesting comment"
                />
                <div className="flex justify-end space-x-2">
                  <Form.SubmitButton>Reply</Form.SubmitButton>
                  <Button variant="dark">Cancel</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        ) : null}
        <div className="w-full relative">
          <Comments
            postId={data.id}
            comments={data?.comments}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  ) : (
    <LoadingFallback />
  );
}
