import { VideoCameraIcon, MicrophoneIcon } from "@heroicons/react/solid";
import Tooltip from "react-tooltip";

import { useMediaStream } from "../../../hooks";
import { MYSELF } from "../../../constants";
import { CrossLineDiv } from "../../../components/Common";

import { PeerVideo, VideoContainer } from "..";

export default function Lobby({ stream, onJoinRoom, currentUser }) {
  const { muted, visible, toggle, toggleVideo } = useMediaStream(stream);

  return (
    <div className="h-screen w-auto grid grid-cols-2 gap-4 place-content-center place-items-center">
      <div className="flex flex-col gap-2">
        <VideoContainer
          id="me"
          muted={muted}
          visible={visible}
          stream={stream}
          userPicture={currentUser?.image || ""}
        >
          <PeerVideo key="me" stream={stream} name={MYSELF} isMe={true} />
        </VideoContainer>

        <div className="flex justify-end gap-2">
          {/* <button
            onClick={toggleVideo}
            data-for="visibility"
            data-tip={`${!visible ? "switch on" : "switch off"}`}
            className="p-3 rounded-xl relative text-white bg-orange-800 hover:bg-orange-900 bg-gradient-to-r from-orange-700 to-orange-400 focus:outline-none"
          >
            <VideoCameraIcon className="h-6 w-6" />
            {!visible && <CrossLineDiv />}
          </button> */}
          <Tooltip id="visibility" effect="solid" />

          <button
            onClick={() => toggle("audio")(stream)}
            data-for="audio"
            data-tip={`${muted ? "unmute" : "mute"}`}
            className="p-3 rounded-xl text-white bg-orange-800 hover:bg-orange-900 bg-gradient-to-r from-orange-700 to-orange-400 focus:outline-none relative"
          >
            <MicrophoneIcon className="h-6 w-6" />
            {muted && <CrossLineDiv />}
          </button>
          <Tooltip id="audio" effect="solid" />
        </div>
      </div>

      <button
        onClick={onJoinRoom}
        type="button"
        className="p-2 text-sm font-medium rounded-md text-white bg-orange-800 hover:bg-orange-900 bg-gradient-to-r from-orange-700 to-orange-400 focus:outline-none"
      >
        Join meeting
      </button>
    </div>
  );
}
