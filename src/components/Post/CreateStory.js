import { useState } from "react";
import router from "next/router";
import { object, z } from "zod";
import "emoji-mart/css/emoji-mart.css";
import Form, { useZodForm } from "../ui/Form/Form";
import { FileInput } from "../ui/Form/FileInput";
import { Card } from "../ui/Card";
import { TextArea } from "../ui/TextArea";
import { EmojiPicker } from "../ui/EmojiPicker";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import axios from "axios";
import { toast } from "react-hot-toast";
const oneOf = (keys) => (val) => {
  for (const k of keys) {
    if (val[k] !== undefined) return true;
  }
  return false;
};

export const CreateStorySchema = object({
  caption: z.string().min(1, "Caption is required.").max(420),
  media: z.any(),
}).refine(oneOf(["caption", "media"]), {
  message: "Please include a text body for stories without images.",
  path: ["caption"],
});

export function CreateStory({ currentUser }) {
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };
  const form = useZodForm({
    schema: CreateStorySchema,
  });

  function handleEmojiPick(emote) {
    form.setValue("caption", form.watch("caption") + emote.native);
  }

  return (
    <div>
      <Form
        form={form}
        onSubmit={async (values) => {
          await createStory({
            variables: {
              input: {
                caption: values.caption,
                media: values?.media?.[0],
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
                placeholder="Include body for your story."
                {...form.register("caption")}
              />
            </div>
            <div className="absolute bottom-3 left-3 flex space-x-3">
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
    </div>
  );
}
