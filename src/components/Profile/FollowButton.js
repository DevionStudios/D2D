import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

export function FollowButton({
  username,
  isFollowing,
  currentUser,
  id,
  ...props
}) {
  const [following, setIsFollowing] = useState(isFollowing);
  useEffect(() => {
    setIsFollowing(isFollowing);
  });

  const followUser = async ({ variables }) => {
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
      if (isFollowing === false) {
        const notification = ` followed you`;
        const response2 = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/create`,
          {
            notification: notification,
            userId: id,
            notificationType: "USER_FOLLOW",
            username: currentUser?.username,
          },
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
      }
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to follow user!");
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
      onClick={() => {
        handleClick();
      }}
      {...props}
    >
      {following ? "Unfollow" : "Follow"}
    </Button>
  );
}
