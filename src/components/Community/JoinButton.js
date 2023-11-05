import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

export function JoinButton({ currentUser, isJoined, communityName, ...props }) {
  const [following, setIsFollowing] = useState(isJoined);
  useEffect(() => {
    setIsFollowing(isJoined);
  });

  const handleJoiningCommunity = async () => {
    // join community
    if (following) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/leave/${communityName}`,
          {},
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          toast.success("Left Community", {
            icon: "👍",
          });
        } else {
          toast.error("Unexpected Error Occured! Check Internet Connectivity!");
          return;
        }
      } catch (e) {
        toast.error("Unexpected Error Occured! Check Internet Connectivity!");
        return;
      }
    } else {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/join/${communityName}`,
          {},
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          toast.success("Joined Community", {
            icon: "👍",
          });
        } else {
          toast.error("Unexpected Error Occured! Check Internet Connectivity!");
          return;
        }
      } catch (e) {
        toast.error("Unexpected Error Occured! Check Internet Connectivity!");
        return;
      }
    }
    setIsFollowing(!following);
    window.location.reload();
  };

  const handleClick = async () => {
    await handleJoiningCommunity();
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
