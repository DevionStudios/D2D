import { useState, useEffect } from "react";
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
import { MentionsInput, Mention } from "react-mentions";
import mentionStyle from "./mentionStyles";
import mentionsInputStyle from "./mentionInputStyles";
import merge from "lodash/merge";
import { toast } from "react-hot-toast";
const oneOf = (keys) => (val) => {
  for (const k of keys) {
    if (val[k] !== undefined) return true;
  }
  return false;
};

export const CreatePostSchema = object({
  media: z.any().optional(),
  gifLink: z.string().optional(),
  hashtags: z.string().optional(),
});

export function CreatePostModal({ currentUser, isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(false);
  const [mentionData, setMentionData] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [caption, setCaption] = useState();
  const handleCaptionChange = (e) => {
    setCaption(handleCaptionChange(e.target.value));
  };
  let customStyle = merge({}, mentionsInputStyle, {
    input: {
      height: 80,
      overflowX: "hidden",
      boxSizing: "border-box",
      overflowY: "visible",
    },
    highlighter: {
      height: 80,
      overflowX: "hidden",
      boxSizing: "border-box",
    },
  });
  const createPost = async ({ variables }) => {
    //post data
    const { input } = variables;

    const content = input.caption;
    const hashtags = [];
    content.replace(/(?<=#).*?(?=( |$))/g, (hashtag) => {
      hashtags.push("#" + hashtag);
      return "";
    });
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
      // router.push("/feed");

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

  const getFollowersAndFollowing = async () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/get/social`;
    try {
      const response = await axios.get(url, {
        headers: {
          cookies: document.cookie,
        },
      });
      const newData = [];
      const followers = response.data?.followers;
      const following = response.data?.following;
      for (let i = 0; i < followers.length; i++) {
        newData.push({
          id: followers[i].username,
          display: followers[i].username,
        });
      }
      for (let i = 0; i < following.length; i++) {
        newData.push({
          id: following[i].username,
          display: following[i].username,
        });
      }
      setMentionData(newData);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getFollowersAndFollowing();
  }, []);
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
          if (
            values?.media?.[0] == undefined &&
            currentGIF == "" &&
            caption?.length <= 0
          ) {
            return toast.error("Please select a media to post without text!");
          } else
            await createPost({
              variables: {
                input: {
                  caption: caption,
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
              {/* <TextArea
                label="Caption"
                placeholder="Include body for your post."
                {...form.register("caption")}
                onChange={(e) => {
                  const capt = e.target.value;
                  const startOfAt = capt.lastIndexOf("@");
                }}
              /> */}
              <label>Caption</label>
              <MentionsInput
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                label="Caption"
                style={customStyle}
                a11ySuggestionsListLabel={"Suggested mentions"}
                placeholder="Include body for your post."
              >
                <Mention
                  trigger="@"
                  data={mentionData}
                  style={mentionStyle}
                  markup="@__display__"
                  appendSpaceOnAdd={true}
                  displayTransform={(id, display) => {
                    return "@" + display;
                  }}
                />
              </MentionsInput>
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
