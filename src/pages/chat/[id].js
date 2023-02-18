import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { Navbar } from "../../components/Common/Navbar/index";
import ChatContainer from "../../components/Chat/ChatContainer";
import axios from "axios";
const Id = ({ currentUser, otherUser }) => {
  const router = useRouter();
  const id = router.query.id;
  const socket = useRef();
  const [otherUserFull, setOtherUserFull] = useState(null);
  const getOtherUser = async () => {
    try {
      const response = await axios["get"](
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/otheruser/id/${id}`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      setOtherUserFull(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (currentUser) {
      socket.current = io(process.env.NEXT_PUBLIC_BASE_URL, {
        transports: ["websocket", "polling", "flashsocket"],
      });
      socket.current.emit("add-user", currentUser.id);
    }
  }, []);

  useEffect(() => {
    getOtherUser();
  }, []);
  return otherUserFull ? (
    <div>
      <Navbar currentUser={currentUser} />
      <ChatContainer
        currentUser={currentUser}
        otherUser={id}
        socket={socket}
        other={otherUserFull}
      />
    </div>
  ) : (
    <>
      <h1>Loading...</h1>
    </>
  );
};

export default Id;
