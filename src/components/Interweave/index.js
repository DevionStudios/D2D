import { stripHexcode } from "emojibase";
import BaseInterwave from "interweave";
import { HashtagMatcher, UrlMatcher } from "interweave-autolink";
import { EmojiMatcher, useEmojiData } from "interweave-emoji";
import { MentionMatcher } from "./MentionMatcher";
import { Url } from "./UrlFactory";
import { useRouter } from "next/router";
const emojiOptions = {
  convertEmoticon: false,
  convertShortcode: true,
  convertUnicode: true,
  enlargeThreshold: 3,
};

export const urlMatcher = new UrlMatcher(
  "url",
  {
    customTLDs: ["app"],
  },
  Url
);

export const emojiMatcher = new EmojiMatcher("emoji", emojiOptions);

export const mentionMatcher = new MentionMatcher("mention", {});

export const hashTagMatcher = new HashtagMatcher("hashtag", {}, (args) => {
  const router = useRouter();
  function handleOnClick(e) {
    router.push(`/search?query=${args.hashtag.split("#")[1]}&type=hashtag`);
  }
  return (
    <button
      className="font-medium text-blue-500 hover:underline"
      onClick={handleOnClick}
    >
      {args.hashtag}
    </button>
  );
});
export function Interweave({
  content,
  matchers = [urlMatcher, emojiMatcher, mentionMatcher, hashTagMatcher],
  ...props
}) {
  const [, emojiSource] = useEmojiData({
    throwErrors: false,
  });

  return (
    <BaseInterwave
      content={content}
      matchers={matchers}
      {...props}
      emojiPath={(hexcode, large) => {
        return `https://cdn.jsdelivr.net/gh/joypixels/emoji-assets@latest/png/${
          large ? 64 : 32
        }/${stripHexcode(hexcode).toLowerCase()}.png`;
      }}
      emojiSize={22}
      emojiSource={emojiSource}
      newWindow
      hashtagUrl={(hashtag) => `/hashtags/${hashtag}`}
      display={(display) => {
        return `/profile/${display}`;
      }}
    />
  );
}
