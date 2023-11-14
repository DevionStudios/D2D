import { useContext } from "react";
import { useUser } from "@auth0/nextjs-auth0";

import { MYSELF } from "../../../constants";
import { UsersConnectionContext } from "../../../context/users-connection";

import VideoContainer from "../../../components/Conference/video-container";
import { PeerVideo } from "..";

export default function MyStream({ stream, muted, visible }) {
  const avatar = useUser().user.picture || "";
  const { myId } = useContext(UsersConnectionContext);

  return (
    <VideoContainer
      id={myId}
      muted={muted}
      visible={visible}
      stream={stream}
      userPicture={avatar}
    >
      <PeerVideo stream={stream} name={MYSELF} isMe={true} />
    </VideoContainer>
  );
}
