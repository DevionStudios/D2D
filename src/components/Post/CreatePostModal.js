import { useState } from "react";
import router from "next/router";
import { object, z } from "zod";
import { EmojiData } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { HiXCircle } from "react-icons/hi";
import { Input } from "../ui/Input";
import Form, { useZodForm } from "../ui/Form/Form";
import { FileInput } from "../ui/Form/FileInput";
import { Card } from "../ui/Card";
import { TextArea } from "../ui/TextArea";
import { EmojiPicker } from "../ui/EmojiPicker";
import { GIFPicker } from "../ui/GIFPicker";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import Modal from "../ui/Modal";
import { Heading } from "../ui/Heading";
import axios from "axios";

const oneOf = (keys) => (val) => {
  for (const k of keys) {
    if (val[k] !== undefined) return true;
  }
  return false;
};

export const CreatePostSchema = object({
  caption: z.string().nonempty("Caption is required.").max(420),
  media: z.any().optional(),
  gifLink: z.string().optional(),
  hashtags: z.string().optional(),
}).refine(oneOf(["caption", "media"]), {
  message: "Please include a text body for posts without images.",
  path: ["caption"],
});

export function CreatePostModal({ currentUser, isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const createPost = async ({ variables }) => {
    //post data
    const { input } = variables;

    const content = input.caption;
    console.log("prev content", content);
    const hashtags = [];
    content.replace(/(?<=#).*?(?=( |$))/g, (hashtag) => {
      hashtags.push("#" + hashtag);
      return "";
    });
    console.log("content", content);
    console.log("tags", hashtags);
    const formdata = new FormData();
    formdata.append("caption", input.caption);
    formdata.append("media", input.media);
    formdata.append("gifLink", input.gifLink);
    for (let i = 0; i < hashtags.length; i++) {
      formdata.append("hashtags", hashtags[i]);
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/create`,
        formdata,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );

      console.log("Response: ", response);

      const caption = input.caption;
      caption.replace(/(?<=@).*?(?=( |$))/g, async (mention) => {
        console.log("Mention: ", mention);

        // create notification of every mention
        const notificationResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/create`,
          {
            notification: ` mentioned you `,
            userId: currentUser?.id,
            notificationType: "MENTION",
            username: mention,
            postId: response.data?.post?.id || null,
          },
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
      });

      //route to feed
      setIsOpen(false);
      router.push("/feed");

      window.location.reload();
    } catch (e) {
      // !remove console.log(e);
    }
    setLoading(false);
  };
  const form = useZodForm({
    schema: CreatePostSchema,
  });

  function handleEmojiPick(emote) {
    form.setValue("caption", form.watch("caption") + emote.native);
  }

  const [currentGIF, setCurrentGIF] = useState("");

  function handleGIFPick(gif) {
    setCurrentGIF(gif.images.original.url);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="sm:max-w-lg"
    >
      <Modal.Header dismiss>
        <Heading size="h4">Create Post</Heading>
      </Modal.Header>
      <Form
        form={form}
        onSubmit={async (values) => {
          await createPost({
            variables: {
              input: {
                caption: values.caption,
                media: values?.media?.[0],
                gifLink: currentGIF,
              },
            },
          });
        }}
      >
        <Card.Body className="space-y-5">
          <div className="relative">
            <div>
              <TextArea
                label="Caption"
                placeholder="Include body for your post."
                {...form.register("caption")}
                onChange={(e) => {
                  const capt = e.target.value;
                  const startOfAt = capt.lastIndexOf("@");
                }}
              />
            </div>
            <div className="left-3 flex space-x-3">
              <EmojiPicker onEmojiPick={handleEmojiPick} />
              <GIFPicker
                disabled={currentGIF !== ""}
                onGIFPick={handleGIFPick}
              />
            </div>
          </div>
          {/* GIF Preview */}
          <div>
            <label className="mb-1 font-medium dark:text-white ">
              GIF Post
            </label>
            {currentGIF ? (
              <div className="relative md:w-1/2 lg:w-1/2 mx-auto">
                <img src={currentGIF} alt="GIF" />
                <button
                  onClick={() => setCurrentGIF("")}
                  className="absolute top-4 right-4"
                >
                  <HiXCircle className="w-6 h-6 hover:text-gray-500" />
                </button>
              </div>
            ) : (
              <p className="text-muted">
                Select a GIF from selector to post a GIF post!
              </p>
            )}
          </div>

          <FileInput
            name="media"
            accept="image/png, image/jpg, image/jpeg, image/gif, video/mp4, video/mkv, video/webm"
          />
        </Card.Body>
        <Card.Footer className="flex justify-end">
          <Form.SubmitButton size="lg" disabled={loading}>
            Upload
          </Form.SubmitButton>
        </Card.Footer>
      </Form>
      {loading && <LoadingFallback />}
    </Modal>
  );
}
