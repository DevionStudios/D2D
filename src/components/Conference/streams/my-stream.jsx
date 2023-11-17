import { useContext } from "react";

import { MYSELF } from "../../../constants";
import { UsersConnectionContext } from "../../../context/users-connection";

import VideoContainer from "../../../components/Conference/video-container";
import { PeerVideo } from "..";

export default function MyStream({ stream, muted, visible, currentUser }) {
  const { myId } = useContext(UsersConnectionContext);

  return (
    <VideoContainer
      id={myId}
      muted={muted}
      visible={visible}
      stream={stream}
      userPicture={currentUser?.image || ""}
    >
      <PeerVideo stream={stream} name={MYSELF} isMe={true} />
    </VideoContainer>
  );
}
