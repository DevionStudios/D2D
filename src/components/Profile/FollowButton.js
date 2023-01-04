import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

export function FollowButton({ username, isFollowing, id, ...props }) {
  const [following, setIsFollowing] = useState(isFollowing);
  //   const [followLoading, setFollowLoading] = useState(false);
  //   const [unfollowLoading, setUnfollowLoading] = useState(false);

  const followUser = async ({ variables }) => {
    const response = await axios.post("http://localhost:5000/api/follows", {
      username: username,
      headers: {
        cookies: document.cookie,
      },
    });
    console.log(response);
  };

  const handleClick = async () => {
    await followUser({
      variables: { input: { username } },
    });
    if (following) {
      setIsFollowing(false);
      toast.success("Followed user", {
        icon: "👍",
      });
    }
    if (!following) {
      setIsFollowing(true);
      toast.success("Unfollowed user", {
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
