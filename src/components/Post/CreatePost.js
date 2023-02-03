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
import axios from "axios";
import clsx from "clsx";
import { toast } from "react-hot-toast";
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

export function CreatePost({ currentUser }) {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    let tagValue = value;
    if (value[0] !== "#") {
      tagValue = "#" + value;
    }
    setTags([...tags, tagValue]);
    e.target.value = "";
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
  }
  function TagsInput() {
    return (
      <div>
        {tags.map((tag, index) => (
          <div key={index}>
            <span
              className={clsx(
                "bg-gray-50 dark:bg-gray-700  shadow-sm border border-r-0 dark:border-gray-500 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 dark:text-gray-100 sm:text-sm"
              )}
            >
              {tag}
            </span>
            <span
              className={clsx(
                "bg-black-50 dark:bg-black-700  shadow-sm border border-r-0 dark:border-black-500 border-gray-300 rounded-l-md rounded-r-md px-3 inline-flex items-center text-gray-500 dark:text-gray-100 sm:text-sm"
              )}
              onClick={() => removeTag(index)}
            >
              &times;
            </span>
          </div>
        ))}
        <input
          className={clsx(
            "w-full transition duration-500 ease-in-out border-2 border-gray-300 bg-gray-50 dark:border-gray-600 shadow-sm dark:bg-gray-800   focus:border-brand-600 focus:ring-blue-300 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 rounded-md disabled:cursor-not-allowed",
            "flex-grow block w-full min-w-0 rounded-none rounded-r-md"
          )}
          type="text"
          placeholder="Press Enter To Add Hashtags (E.g- #d2d)"
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }
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
            postId: response.data.post.id,
          },
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
      });
      //route to feed
      router.push("/feed");
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
    <div>
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
              />
            </div>
            <div className="absolute bottom-3 left-3 flex space-x-3">
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
    </div>
  );
}
