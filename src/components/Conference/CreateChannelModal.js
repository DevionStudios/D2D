import { useState } from "react";
import { object, z } from "zod";
import "emoji-mart/css/emoji-mart.css";
import { Input } from "../ui/Input";
import Form, { useZodForm } from "../ui/Form/Form";
import { Card } from "../ui/Card";
import { EmojiPicker } from "../ui/EmojiPicker";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import Modal from "../ui/Modal";
import { Heading } from "../ui/Heading";
import axios from "axios";
import { toast } from "react-hot-toast";

export const createChannelSchema = object({
  media: z.any().optional(),
  gifLink: z.string().optional(),
  hashtags: z.string().optional(),
});

export function CreateChannelModal({
  currentUser,
  communityName,
  isOpen,
  setIsOpen,
}) {
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [caption, setCaption] = useState();
  const handleCaptionChange = (e) => {
    setCaption(handleCaptionChange(e.target.value));
  };

  const createChannel = async ({ variables }) => {
    const { input } = variables;

    const formdata = new FormData();
    formdata.append("description", input.caption);
    formdata.append("isPublic", input.isPublic);
    formdata.append("communityName", communityName);

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/meeting/create`,
        formdata,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );

      toast.success("🚀 New channel created ", {
        style: {
          fontFamily: "Poppins",
          color: "black",
        },
      });

      setLoading(false);
      setIsOpen(false);

      window.location.reload();
    } catch (e) {
      toast.error("Failed to create channel.", {
        style: {
          fontFamily: "Poppins",
          color: "black",
        },
      });
      // console.log(e);
    }
    setLoading(false);
  };
  const form = useZodForm({
    schema: createChannelSchema,
  });

  function handleEmojiPick(emote) {
    setCaption(caption + emote.native);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="sm:max-w-lg"
    >
      <Modal.Header dismiss>
        <Heading size="h4">Create Channel</Heading>
      </Modal.Header>
      <Form
        form={form}
        onSubmit={async (values) => {
          if (!caption) {
            return toast.error("Please give a channel description!");
          } else
            await createChannel({
              variables: {
                input: {
                  description: caption,
                  isPublic: isPublic,
                },
              },
            });
        }}
      >
        <Card.Body className="space-y-5">
          <div className="relative">
            <div>
              <label>Desription</label>
              <Input
                value={caption}
                onChange={(e) => {
                  setCaption(e.target.value);
                }}
                placeholder="Write channel description."
              ></Input>
            </div>
            <div className="left-3 flex space-x-3">
              <EmojiPicker onEmojiPick={handleEmojiPick} />
            </div>
          </div>
          <div className="relative">
            <div>
              <div className="flex items-center">
                <input
                  id="public"
                  name="public"
                  type="checkbox"
                  value={isPublic}
                  onChange={(e) => {
                    setIsPublic(e.target.checked);
                  }}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="comments"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200 "
                >
                  Is it a public channel?
                </label>
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="flex justify-end">
          <Form.SubmitButton size="lg" disabled={loading}>
            Create
          </Form.SubmitButton>
        </Card.Footer>
      </Form>
      {loading && <LoadingFallback />}
    </Modal>
  );
}
