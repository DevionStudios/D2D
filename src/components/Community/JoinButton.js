import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

export function JoinButton({ currentUser, isJoined, ...props }) {
  const [following, setIsFollowing] = useState(isJoined);
  useEffect(() => {
    setIsFollowing(isJoined);
  });

  const joinCommunity = async ({ variables }) => {
    // join community
    setIsFollowing(!following);
  };

  const handleClick = async () => {
    await joinCommunity();
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
      {following ? "Leave" : "Join"}
    </Button>
  );
}
