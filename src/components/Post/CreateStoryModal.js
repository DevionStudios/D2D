import { useState, useEffect } from "react";
import router from "next/router";
import { object, z } from "zod";
import "emoji-mart/css/emoji-mart.css";
import Form, { useZodForm } from "../ui/Form/Form";
import { FileInput } from "../ui/Form/FileInput";
import { Card } from "../ui/Card";
import { TextArea } from "../ui/TextArea";
import { EmojiPicker } from "../ui/EmojiPicker";
import Modal from "../ui/Modal";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
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

export const CreateStorySchema = object({
  media: z.any(),
});

export function CreateStoryModal({ currentUser, isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(false);
  const [mentionData, setMentionData] = useState([]);
  const [caption, setCaption] = useState();
  const createStory = async ({ variables }) => {
    //story data
    const { input } = variables;

    if (!input.media) {
      toast.error("Please include an image.");
      return;
    }

    const formdata = new FormData();
    formdata.append("caption", input.caption);
    formdata.append("media", input.media);
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/story/create`,
        formdata,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      //route to feed
      toast.success("Yayy! Story posted");
      router.push(`/stories/${currentUser.username}`);
    } catch (e) {
      console.log(e);
      toast.error("Failed to create story. Try again.");
      setLoading(false);
    }
  };
  const form = useZodForm({
    schema: CreateStorySchema,
  });

  function handleEmojiPick(emote) {
    form.setValue("caption", form.watch("caption") + emote.native);
  }
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
        <Heading size="h4">Create Story</Heading>
      </Modal.Header>
      <Form
        form={form}
        onSubmit={async (values) => {
          if (values?.media?.[0] == undefined && caption?.length <= 0) {
            return toast.error("Please select a media to post without text!");
          } else
            await createStory({
              variables: {
                input: {
                  caption: caption,
                  media: values?.media?.[0],
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
                placeholder="Include body for your story."
                {...form.register("caption")}
              /> */}
              <label>Caption</label>
              <MentionsInput
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                label="Caption"
                style={customStyle}
                a11ySuggestionsListLabel={"Suggested mentions"}
                placeholder="Include body for your story."
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
            </div>
          </div>

          <FileInput
            name="media"
            accept="image/png, image/jpg, image/jpeg, image/gif, video/mp4, video/mkv, video/webm"
          />
        </Card.Body>
        <Card.Footer className="flex justify-end">
          <Form.SubmitButton size="lg">Upload</Form.SubmitButton>
        </Card.Footer>
      </Form>
      {loading && <LoadingFallback />}
    </Modal>
  );
}
