import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

export function FollowButton({ username, isFollowing, id, ...props }) {
  const [following, setIsFollowing] = useState(isFollowing);
  //   const [followLoading, setFollowLoading] = useState(false);
  //   const [unfollowLoading, setUnfollowLoading] = useState(false);

  const followUser = async ({ variables }) => {
    console.log("helmo");
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/follow/users`,
        {
          username: username,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (e) {
      toast.error("Failed to follow user");
      console.log(e);
    }
  };

  const handleClick = async () => {
    await followUser({
      variables: { input: { username } },
    });
    if (following) {
      setIsFollowing(false);
      toast.success("Unfollowed user", {
        icon: "👍",
      });
    } else {
      setIsFollowing(true);
      toast.success("Followed user", {
        icon: "👍",
      });
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
