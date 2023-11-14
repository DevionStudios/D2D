import { useContext } from "react";

import { MutedIcon } from "../../../assets/icons";
import { UsersConnectionContext } from "../../../context/users-connection";
import { UsersStateContext } from "../../../context/users-settings";

import { ActiveSpeaker, HostControlPanel, VideoPlug } from "..";

const VideoContainer = ({
  id,
  muted,
  visible,
  children,
  stream,
  userPicture,
  onMutePeer,
  onRemovePeer,
}) => {
  const { myId } = useContext(UsersConnectionContext);
  const { isHost } = useContext(UsersStateContext);

  return (
    <div
      key={id}
      className="relative group h-fit drop-shadow-2xl shadow-indigo-500/50"
    >
      {!visible && <VideoPlug userPicture={userPicture} />}
      <div className={`${!visible ? "hidden" : ""}`}>{children}</div>

      {muted ? (
        <div className="absolute top-3 right-3">
          <MutedIcon />
        </div>
      ) : (
        <ActiveSpeaker stream={stream} />
      )}

      {isHost && myId !== id && (
        <HostControlPanel
          onMutePeer={() => onMutePeer && onMutePeer(id)}
          onRemovePeer={() => onRemovePeer && onRemovePeer(id)}
          isMuted={muted}
        />
      )}
    </div>
  );
};

export default VideoContainer;
