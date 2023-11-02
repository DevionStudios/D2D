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
import mentionsInputStyle from "../Post/mentionInputStyles";
import merge from "lodash/merge";
import { toast } from "react-hot-toast";
import clsx from "clsx";
const oneOf = (keys) => (val) => {
  for (const k of keys) {
    if (val[k] !== undefined) return true;
  }
  return false;
};

export const CreatePostSchema = object({
  publicName: z.string(),
  description: z.string(),
  avatar: z.any().optional(),
  banner: z.any().optional(),
  tags: z.string().optional(),
});

export function CreateCommunityModal({ currentUser, isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(false);
  const [mentionData, setMentionData] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [description, setCaption] = useState();
  const [rules, setRules] = useState([]);
  const [isNSFW, setIsNSFW] = useState(false);
  const [tags, setTags] = useState([]);
  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    let tagValue = value;
    setTags([...tags, tagValue]);
    e.target.value = "";
  }
  function handleKeyDownRules(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    let ruleValue = value;
    let tempRule = rules;
    tempRule.push(ruleValue);
    setRules(tempRule);
    e.target.value = "";
  }
  function removeRule(index) {
    setRules(rules.filter((el, i) => i !== index));
  }
  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
  }
  const handleDescriptionChange = (e) => {
    setCaption(handleDescriptionChange(e.target.value));
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
  const createPost = async (values) => {
    const { publicName, identity, description, avatar, banner } = values;
    const formData = new FormData();
    formData.append("publicName", publicName);
    formData.append("description", description);
    formData.append("avatarImage", avatar);
    formData.append("bannerImage", banner);
    formData.append("tags", tags);
    formData.append("rules", rules);
    console.log("hemlo");
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/create`,
        formData,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      if (response.status == 201) {
        toast.success("Community Created Successfully");
        setIsOpen(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create post!");
    }

    // setIsOpen(false);
    // window.location.reload();
    setLoading(false);
  };
  const form = useZodForm({
    schema: CreatePostSchema,
  });

  function handleEmojiPick(emote) {
    form.setValue("description", form.watch("description") + emote.native);
  }

  function TagsInput() {
    return (
      <div>
        {tags.map((tag, index) => (
          <div key={index}>
            <span
              className={clsx(
                "bg-gray-50 dark:bg-gray-700  shadow-sm dark:border-gray-500 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 dark:text-gray-100 sm:text-sm"
              )}
            >
              {tag}
            </span>
            <span
              className={clsx(
                "bg-black-50 dark:bg-black-700  ml-2 shadow-sm border dark:border-black-500 border-gray-300 rounded-l-md rounded-r-md px-3 inline-flex items-center text-gray-500 dark:text-gray-100 sm:text-sm"
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
          name="tags"
          placeholder="Press Enter To Add Tags"
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }
  function RulesInput() {
    return (
      <div>
        {rules.map((rule, index) => (
          <div key={index}>
            <span
              className={clsx(
                "bg-gray-50 dark:bg-gray-700  shadow-sm border dark:border-gray-500 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 dark:text-gray-100 sm:text-sm"
              )}
            >
              {rule}
            </span>
            <span
              className={clsx(
                "bg-black-50 dark:bg-black-700 ml-2 shadow-sm border dark:border-black-500 border-gray-300 rounded-l-md rounded-r-md px-3 inline-flex items-center text-gray-500 dark:text-gray-100 sm:text-sm"
              )}
              onClick={() => removeRule(index)}
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
          name="rules"
          placeholder="Press Enter To Add Rules"
          onKeyDown={handleKeyDownRules}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="sm:max-w-lg"
    >
      <Modal.Header dismiss>
        <Heading size="h4">Create Community</Heading>
      </Modal.Header>
      <Form
        form={form}
        onSubmit={async (values) => {
          // submit the form
          createPost(values);
        }}
      >
        <Card.Body className="space-y-5">
          <div className="relative">
            <div>
              <Input
                label="Public Name"
                name="publicName"
                placeholder={"Enter public name of your community"}
                {...form.register("publicName")}
              />
            </div>
            <div className="left-3 flex space-x-3">
              <EmojiPicker onEmojiPick={handleEmojiPick} />
            </div>
          </div>
          <div className="relative">
            <div>
              <TextArea
                label="Description"
                name="description"
                placeholder={"Include description of your community"}
                {...form.register("description")}
              />
            </div>
            <div className="left-3 flex space-x-3">
              <EmojiPicker onEmojiPick={handleEmojiPick} />
            </div>
          </div>

          <FileInput
            name="avatar"
            label="Avatar"
            accept="image/png, image/jpg, image/jpeg, image/gif, video/mp4, video/mkv, video/webm"
            {...form.register("avatar")}
          />

          <FileInput
            name="banner"
            label="Banner"
            accept="image/png, image/jpg, image/jpeg, image/gif, video/mp4, video/mkv, video/webm"
            {...form.register("banner")}
          />
          <div className="relative">
            <label htmlFor="tags">
              Tags
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                (optional)
              </span>
            </label>
            <div>
              <TagsInput />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="rules">
              Community Rules
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                (optional)
              </span>
            </label>
            <div>
              <RulesInput />
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
