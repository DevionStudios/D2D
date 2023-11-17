import { createContext, useState } from "react";

import Room from "../../app";
import { Lobby } from "../../components/Conference";
import { useMediaStream } from "../../hooks";

import { LoaderError } from "../../components/Common";
import { FAILURE_MSG, LOADER_STREAM_MSG } from "../../constants";

export const MeetingContext = createContext({});

export default function Meeting({ currentUser }) {
  const [isLobby, setIsLobby] = useState(true);
  const { stream, isLoading } = useMediaStream();

  if (isLoading) return <LoaderError msg={LOADER_STREAM_MSG} />;
  if (!stream) return <LoaderError msg={FAILURE_MSG} />;

  if (isLobby)
    return (
      <Lobby
        currentUser={currentUser}
        stream={stream}
        onJoinRoom={() => setIsLobby(false)}
      />
    );

  return <Room currentUser={currentUser} stream={stream} />;
}

Meeting.getLayout = function getLayout(page) {
  return <>{page}</>;
};
