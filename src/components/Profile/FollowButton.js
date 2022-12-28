import { useState } from "react";

import { Button } from "../ui/Button";

export function FollowButton({ username, isFollowing, id, ...props }) {
  const [following, setIsFollowing] = useState(isFollowing);
  //   const [followLoading, setFollowLoading] = useState(false);
  //   const [unfollowLoading, setUnfollowLoading] = useState(false);

  const unfollowUser = async ({ variables }) => {
    // code
  };
  const followUser = async ({ variables }) => {};
  const handleClick = async () => {
    if (following) {
      await unfollowUser({
        variables: { input: { username } },
      });
      setIsFollowing(false);
    }
    if (!following) {
      await followUser({
        variables: { input: { username } },
      });
      setIsFollowing(true);
    }
  };
  return (
    <Button
      //   loading={followLoading || unfollowLoading}
      onClick={() => {
        handleClick();
      }}
      {...props}
    >
      {following ? "Unfollow" : "Follow"}
    </Button>
  );
}
