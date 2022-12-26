import { useState } from "react";

import { Button } from "../ui/Button";

let FOLLOW_USER_MUTATION;
let UNFOLLOW_USER_MUTATION;

export function FollowButton({ username, isFollowing, id, ...props }) {
  const [following, setIsFollowing] = useState(isFollowing);

  // ṭhe cache update here does not work for some reason

  let followUser, followLoading;

  let unfollowUser, unfollowLoading;

  return (
    <Button
      loading={followLoading || unfollowLoading}
      onClick={() => {
        if (following) {
          unfollowUser({
            variables: { input: { username } },
          });
          setIsFollowing(false);
        }
        if (!following) {
          followUser({
            variables: { input: { username } },
          });
          setIsFollowing(true);
        }
      }}
      {...props}
    >
      {following ? "Unfollow" : "Follow"}
    </Button>
  );
}
