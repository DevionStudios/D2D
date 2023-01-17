import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { Navbar } from "../../components/Common/Navbar/index";
import ChatContainer from "../../components/Chat/ChatContainer";
const Id = ({ currentUser, otherUser }) => {
  const router = useRouter();
  const id = router.query.id;
  const socket = useRef();

  useEffect(() => {
    if (currentUser) {
      socket.current = io(process.env.NEXT_PUBLIC_BASE_URL);
      socket.current.emit("add-user", currentUser.id);
    }
  });

  return (
    <div>
      <Navbar currentUser={currentUser} />
      <ChatContainer currentUser={currentUser} otherUser={id} socket={socket} />
    </div>
  );
};

export default Id;
