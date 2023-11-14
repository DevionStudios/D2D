import { useContext } from "react";

import { UsersStateContext } from "../../../context/users-settings";
import { UsersConnectionContext } from "../../../context/users-connection";
import { UsersUpdaterContext } from "../../../context/users-settings";

import VideoContainer from "../../../components/Conference/video-container";

export default function OtherStreams() {
  const { streams, isMuted, isHidden, avatars } = useContext(UsersStateContext);
  const { muteUser } = useContext(UsersUpdaterContext);
  const { leaveRoom } = useContext(UsersConnectionContext);

  return (
    <>
      {Object.entries(streams).map(([id, element]) => (
        <VideoContainer
          key={id}
          id={id}
          muted={isMuted[id]}
          visible={!isHidden[id]}
          userPicture={avatars[id]}
          stream={element.props.stream}
          onMutePeer={muteUser}
          onRemovePeer={leaveRoom}
        >
          {element}
        </VideoContainer>
      ))}
    </>
  );
}
