import { stripHexcode } from "emojibase";
import BaseInterwave from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { EmojiMatcher, useEmojiData } from "interweave-emoji";
import { MentionMatcher } from "./MentionMatcher";
import { Url } from "./UrlFactory";

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

export function Interweave({
  content,
  matchers = [urlMatcher, emojiMatcher, mentionMatcher],
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
      display={(display) => {
        return `/profile/${display}`;
      }}
    />
  );
}
