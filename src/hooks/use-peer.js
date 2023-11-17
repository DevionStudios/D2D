import { useContext, useEffect, useState } from "react";

import { useMediaStream } from "./index";
import { SocketContext } from "../pages/_app";
import { useRouter } from "next/router";

import { error } from "../utils";

/**
 * Creates a peer and joins them into the room
 * @returns peer object, its id and meta-state whether is peer fully created
 */
const usePeer = (stream, currentUser) => {
  const socket = useContext(SocketContext);
  const room = useRouter().query.meetingId;

  const { muted, visible } = useMediaStream(stream);

  const [isLoading, setIsLoading] = useState(true);
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    (async function createPeerAndJoinRoom() {
      try {
        const peer = new (await import("peerjs")).default();
        setPeer(peer);
        setIsLoading(false);

        peer.on("open", (id) => {
          console.log("your device id: ", id);
          setMyId(id);
          socket.emit("room:join", {
            room,
            user: {
              id,
              muted,
              visible,
              name: currentUser?.username,
              picture: currentUser?.image,
            },
          });
        });

        peer.on("error", error("Failed to setup peer connection"));
      } catch (e) {
        error("Unable to create peer")(e);
      }
    })();
  }, []);

  return {
    peer,
    myId,
    isPeerReady: !isLoading,
  };
};

export default usePeer;
