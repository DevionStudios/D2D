import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
// import Peer from "peerjs";
import Video from "./video";
import SharedContent from "./Shared";
import dotenv from "dotenv";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { set } from "zod";
import { io } from "socket.io-client";

dotenv.config();
let peer;

const RoomPage = ({ isBoardActive, setBoardActive, currentUser }) => {
  const router = useRouter();
  const { roomId } = router.query;
  const socket = useRef();

  const [peer, setPeer] = useState(null);
  socket?.current?.on("error", (err) => {
    console.log(err);
    toast.error("Error Occured");
    router.back();
  });
  const setupPeer = async () => {
    const fn = async () => {
      const PeerJs = (await import("peerjs")).default;
      // set it to state here
      let peer = new PeerJs(undefined, {
        path: "/peerJs",
        host: process.env.NEXT_PUBLIC_BASE_URL,
        port: 5000,
        // key: "peerJs",
        secure: false,
      });
      setPeer(peer);
      socket.current.emit("join-room", roomId, peer.id);
    };
    await fn();
  };
  useEffect(() => {
    socket.current = io.connect(process.env.NEXT_PUBLIC_BASE_URL);
    if (!peer) setupPeer();
    return socket.disconnect;
  }, []);

  return peer ? (
    <>
      {console.log(peer)}
      <div className="flex flex-col md:flex-row  xs:flex-col w-full justify-start gap-x-4 ">
        <SharedContent
          isBoardActive={isBoardActive}
          setBoardActive={setBoardActive}
          peer={peer}
          socket={socket.current}
        />
        <Video roomId={roomId} peer={peer} socket={socket.current} />
        {/* <button
          onClick={() => {
            socket.emit("hello");
          }}
        >
          OKKK
        </button> */}
      </div>
    </>
  ) : (
    <div>Sorry</div>
  );
};

export default RoomPage;
