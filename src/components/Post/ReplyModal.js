import { format } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";

// import { Interweave } from "../Interweave";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { z } from "zod";
import Form, { useZodForm } from "../ui/Form/Form";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";
import { TextArea } from "../ui/TextArea";
import Link from "next/link";

export function ReplyModal({
  isOpen,
  onClose,
  comments,
  setComments,
  ...props
}) {
  const createComment = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/create`,
        {
          caption: values.variables.input.caption,
          postId: props.post.id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      setComments(comments + 1);
      toast.success("Comment created successfully");
      const notification = ` replied to your `;
      const response2 = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/create`,
        {
          notification: notification,
          userId: props.post.author?.id,
          notificationType: "POST_REPLY",
          username: props.currentUser?.username,
          postId: props.post?.id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went Wrong!");
    }
  };

  const CommentSchema = z.object({
    caption: z.string().min(1, "Comment must be atleast 1 character long."),
  });

  const form = useZodForm({
    schema: CommentSchema,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg">
      <Modal.Header dismiss>
        <Heading size="h4" className="-mt-2 mb-3">
          Reply
        </Heading>
      </Modal.Header>
      <div className="max-w-3xl mx-auto">
        <div className="px-3">
          <Link href={`/profile/${props.post?.author?.username}`} passHref>
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={props.post?.author?.image}
                  alt=""
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium ">
                  <a href="#" className="hover:underline">
                    {props.post?.author?.name + " " ?? ""}
                    <span className="text-muted text-sm ml-2">
                      @{props.post?.author?.username}
                    </span>
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  <a href="#" className="hover:underline">
                    <time>
                      {format(
                        new Date(props.post.createdAt),
                        "MMMM d, hh:mm aaa"
                      )}
                    </time>
                  </a>
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className=" mt-4">
          <p className=" space-y-4 dark:text-gray-300">
            {/* {props.post.caption && !props.post.image && (
              <Interweave content={props.post.caption} />
            )}
            {props.post.caption && props.post.image && (
              <Interweave content={props.post.caption + props.post.image} />
            )} */}
          </p>
        </div>
        <div className="w-full mt-4">
          <Card.Body noPadding>
            <Form
              form={form}
              onSubmit={async (values) => {
                await createComment({
                  variables: {
                    input: {
                      caption: values.caption,
                      postId: props.post.id,
                    },
                  },
                });
              }}
            >
              <TextArea
                label="Your reply"
                placeholder="An interesting comment"
                {...form.register("caption")}
              />

              <div className="flex justify-end space-x-2">
                <Form.SubmitButton>Reply</Form.SubmitButton>
                <Button type="button" onClick={onClose} variant="dark">
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </div>
      </div>
    </Modal>
  );
}
