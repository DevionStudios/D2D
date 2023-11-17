import { useContext, useEffect, useState } from "react";

import { ControlPanel, Chat, Status } from "../components/Conference";
import { Streams, SharedScreenStream } from "../components/Conference/streams";
import { usePeer, useScreen } from "../hooks";
import useMediaStream from "../hooks/use-media-stream";
import { SocketContext } from "../pages/_app";
import { UsersSettingsProvider, UsersConnectionProvider } from "../context";
import { useRouter } from "next/router";
// import { toast, ToastContainer } from "react-toastify";
import toast from "react-hot-toast";

import { LoaderError, Modal } from "../components/Common";
import { FAILURE_MSG, LOADER_PEER_MSG, TOAST_PROPS } from "../constants";

export default function App({ stream, currentUser }) {
  const router = useRouter();
  const socket = useContext(SocketContext);

  const { muted, visible, toggle, toggleVideo } = useMediaStream(stream);
  const { peer, myId, isPeerReady } = usePeer(stream, currentUser);
  const { startShare, stopShare, screenTrack } = useScreen(stream);

  const [modal, setModal] = useState("hidden");
  // (useState < "hidden") | "chat" | "status" | ("close" > "hidden");
  const [fullscreen, setFullscreen] = useState(false);

  function replaceTrack(track) {
    return (peer) => {
      const sender = peer.peerConnection
        ?.getSenders()
        .find((s) => s.track?.kind === track.kind);

      sender?.replaceTrack(track);
    };
  }

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("host:muted-user", (peerId) => {
      if (myId === peerId) {
        toggleKind("audio");
        toast("you are muted by host");
      } else {
        toast("user muted by host");
      }
    });

    return () => {
      socket.off("host:muted-user");
    };
  }, [myId]);

  if (!isPeerReady) return <LoaderError msg={LOADER_PEER_MSG} />;
  if (!peer) return <LoaderError msg={FAILURE_MSG} />;

  async function toggleKind(kind, users) {
    switch (kind) {
      case "audio": {
        toggle("audio")(stream);
        socket.emit("user:toggle-audio", myId);
        return;
      }
      case "video": {
        toggleVideo((newVideoTrack) =>
          users.forEach(replaceTrack(newVideoTrack))
        );
        socket.emit("user:toggle-video", myId);
        return;
      }
      case "screen": {
        if (screenTrack) {
          stopShare(screenTrack);
          socket.emit("user:stop-share-screen");
          setFullscreen(false);
          toast("Stopped presenting screen");
        } else {
          await startShare(
            () => {
              socket.emit("user:share-screen");
              toast.success("Starting presenting screen", {});
            },
            () => socket.emit("user:stop-share-screen")
          );
        }
        return;
      }
      case "fullscreen": {
        setFullscreen(!fullscreen);
        return;
      }
      case "chat": {
        modal == "chat" ? setModal("hidden") : setModal("chat");
        return;
      }
      case "users": {
        modal == "status" ? setModal("hidden") : setModal("status");
        return;
      }
      default:
        break;
    }
  }

  return (
    <div className="flex">
      <UsersSettingsProvider currentUser={currentUser}>
        <div className="sm:flex hidden flex-col p-4 w-full h-screen">
          <UsersConnectionProvider
            currentUser={currentUser}
            stream={stream}
            myId={myId}
            peer={peer}
          >
            <div className="flex h-full place-items-center place-content-center gap-4">
              <SharedScreenStream
                currentUser={currentUser}
                sharedScreen={screenTrack}
                fullscreen={fullscreen}
              />

              <Streams
                currentUser={currentUser}
                stream={stream}
                muted={muted}
                visible={visible}
                sharedScreen={screenTrack}
                fullscreen={fullscreen}
              />
            </div>

            <div className="flex items-center">
              <ControlPanel
                currentUser={currentUser}
                visible={visible}
                muted={muted}
                screenTrack={Boolean(screenTrack)}
                chat={modal == "chat"}
                onToggle={toggleKind}
                onLeave={() => router.push("/")}
              />
            </div>
          </UsersConnectionProvider>
        </div>

        <Modal
          title={
            modal === "chat"
              ? "Meeting Chat"
              : modal === "status"
              ? "People"
              : ""
          }
          modal={modal}
          onClose={() => setModal("hidden")}
        >
          <div className={modal !== "chat" ? "hidden" : ""}>
            <Chat currentUser={currentUser} />
          </div>
          <div className={modal !== "status" ? "hidden" : ""}>
            <Status currentUser={currentUser} muted={muted} visible={visible} />
          </div>
        </Modal>
      </UsersSettingsProvider>
    </div>
  );
}
