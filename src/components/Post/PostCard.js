import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { format, formatDistance } from "date-fns";
import toast from "react-hot-toast";
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

import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import Modal from "../ui/Modal";
import { Link } from "~/components/ui/Link";

import { ViewLikes } from "./ViewLikes";
import { SEO } from "../SEO";

import axios from "axios";

export const CommentSchema = z.object({
  body: z.string().min(1, "Comment must be atleast 1 character long."),
});

export function PostCard({ id, isMine }) {
  const [imageModal, setImageModal] = useState(false);
  const [likesModal, setLikesModal] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fetchPostData = async () => {
    setLoading(true);
    console.log("Hello", id);
    try {
      const res = await axios.get(`http://localhost:5000/api/post/${id}`);
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchPostData();
  }, []);
  const form = useZodForm({
    schema: CommentSchema,
  });

  let createComment;

  let error;

  let toggleLike, isLikeLoading;

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

  // const shareData = {
  //   title: `${data.author.username} on D2D.`,
  //   text: `${
  //     data.seePost.caption ?? "Check it out now! See what they have to say."
  //   }`,
  //   url: `https://d2d.vercel.app/post/${data.seePost.id}`,
  // };

  return data && data.author ? (
    <>
      <SEO
        title={`${data.author.username} on D2D: ${
          data.caption ? data.caption.slice(0, 255) : ""
        }`}
        description={data.caption ? data.caption.slice(0, 255) : ""}
        image={data.author.image}
        path={`/post/${data.id}`}
      />
      <div className="max-w-2xl mx-auto flex flex-wrap space-y-4 relative">
        <div className="absolute -left-24 top-5">
          <Button variant="dark" onClick={() => router.push("/feed")}>
            {" "}
            ← Back
          </Button>
        </div>
        <div className="w-full md:pb-0">
          <div>
            <Card className="rounded-t-lg ">
              <div className="px-4 py-4  sm:p-4 sm:rounded-lg">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={data.author.image}
                      alt=""
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className=" font-medium ">
                      <Link
                        href={`/profile/${data.author.username}`}
                        className="no-underline"
                      >
                        {data.author.name}
                        {/* {post.user.lastName ? post.user.lastName : ""} */}
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
                    <PostDropdown
                      id={data.id}
                      isMine={isMine}
                      caption={data.caption ?? ""}
                      gifLink={data.gifImage ?? ""}
                    />
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <Interweave content={data.caption} />
              </div>
              {data.gifImage && (
                <div className="mx-auto w-11/12 rounded-lg pb-4 overflow-hidden">
                  <img
                    className="w-full rounded-lg"
                    src={data.gifImage}
                    alt={`A moving GIF image posted by ${data.author.username}.`}
                  />
                </div>
              )}
              {data.media && (
                <div className="aspect-w-1 aspect-h-1 ">
                  <NextImage
                    onClick={() => setImageModal(true)}
                    src={data.media}
                    layout="fill"
                    objectFit="cover"
                    placeholder="empty"
                    className="!w-full"
                  />
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

            <Card className="py-2 px-4 flex justify-between space-x-8">
              <div className="flex space-x-6">
                <span className="inline-flex">
                  <p className="font-bold">{data.likes}</p>
                  <button onClick={() => setLikesModal(true)}>
                    <p className="text-muted ml-1 ">Likes</p>{" "}
                  </button>
                  <ViewLikes
                    isOpen={likesModal}
                    onClose={() => setLikesModal(false)}
                  />
                </span>
                <span className="inline-flex">
                  <p className="font-bold">{data.comments}</p>
                  <p className="text-muted ml-1 ">Comments</p>{" "}
                </span>
              </div>
            </Card>

            <Card className="py-4 px-4 flex justify-between space-x-8 rounded-b-lg">
              <div className="flex space-x-6">
                <span className="inline-flex items-center text-sm">
                  <Button
                    loading={isLikeLoading}
                    onClick={async () => {
                      // setHasLiked(!hasLiked);
                      // setLikesCount(hasLiked ? likesCount - 1 : likesCount + 1);
                      await toggleLike({
                        variables: { id: data.id },
                      });
                    }}
                    variant="dark"
                  >
                    {data.likes > 0 ? (
                      <HiHeart
                        className="h-5 w-5 text-brand-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <HiOutlineHeart className="h-5 w-5" aria-hidden="true" />
                    )}
                    <span className="ml-1">Like</span>
                    <span className="sr-only">likes</span>{" "}
                  </Button>
                </span>

                <span className="inline-flex items-center text-sm">
                  <Button onClick={() => form.setFocus("body")} variant="dark">
                    <span>
                      <HiOutlineReply className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="ml-1">Reply</span>
                    <span className="sr-only">Reply</span>
                  </Button>
                </span>
              </div>
              <div className="flex text-sm">
                <span className="inline-flex items-center text-sm">
                  <Button
                    variant="dark"
                    onClick={async () => {
                      navigator.clipboard
                        .writeText(`https://d2d.vercel.app/post/${data.id}`)
                        .then(() => toast.success("Link copied to clipboard"));
                    }}
                  >
                    <span>
                      <HiOutlineShare className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-medium ml-1">Share</span>
                    <span className="sr-only">Share</span>
                  </Button>
                </span>
              </div>
            </Card>
          </div>
        </div>
        <Card className="w-full" rounded="lg">
          <Card.Body>
            <Form
              form={form}
              onSubmit={async (values) => {
                await createComment({
                  variables: {
                    input: {
                      body: values.body,
                      postId: router.query.id,
                    },
                  },
                });
                toast.success("Your comment has been posted.");
                form.reset();
              }}
            >
              <TextArea
                label="Your reply"
                {...form.register("body")}
                placeholder="An interesting comment"
              />
              <div className="flex justify-end space-x-2">
                <Form.SubmitButton>Reply</Form.SubmitButton>
                <Button variant="dark">Cancel</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        {/* <div className="w-full relative">
          <Comments postId={data.id} />
        </div> */}
      </div>
    </>
  ) : (
    <LoadingFallback />
  );
}
