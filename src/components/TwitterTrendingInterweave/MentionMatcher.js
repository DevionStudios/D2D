import React from "react";
import { Matcher, MatchResponse } from "interweave";
import { useRouter } from "next/router";
import { Tooltip } from "../ProfilePopover/Tooltip";
// import { UserProfilePopover } from "../ProfilePopover";

export const MENTION_PATTERN = /\B@(\w+)/;

export function Mention(props) {
  const router = useRouter();

  function handleOnClick() {
    router.push(`/profile/${props.display.replace("@", "")}`);
  }

  return (
    <Tooltip
    // content={<UserProfilePopover username={props.display.replace("@", "")} />}
    >
      <button className="font-medium underline" onClick={handleOnClick}>
        {props.display}
      </button>
    </Tooltip>
  );
}

export class MentionMatcher extends Matcher {
  replaceWith(match, props) {
    return React.createElement(Mention, props, match);
  }

  asTag() {
    return "a";
  }

  match(string) {
    return this.doMatch(string, MENTION_PATTERN, (matches) => {
      return {
        display: matches[0],
      };
    });
  }
}
