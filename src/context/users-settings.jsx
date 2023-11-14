import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { append, isHost } from "../utils";

import { SocketContext } from "../pages/_app";

export const UsersUpdaterContext = createContext({});
export const UsersStateContext = createContext({});

export default function UsersSettingsProvider({ children }) {
  const router = useRouter();
  const socket = useContext(SocketContext);

  const [streams, setStreams] = useState({});

  const [isMuted, setIsMuted] = useState({});
  const [isHidden, setIsHidden] = useState({});
  const [avatars, setAvatars] = useState({});
  const [names, setNames] = useState({});

  const [sharedScreenTrack, setSharedScreenTrack] = useState(null);

  useEffect(() => {
    socket.on("user:toggled-video", (peerId) =>
      setIsHidden(append({ [peerId]: !isHidden[peerId] }))
    );
  }, [isHidden]);

  useEffect(() => {
    socket.on("user:toggled-audio", (peerId) =>
      setIsMuted(append({ [peerId]: !isMuted[peerId] }))
    );
  }, [isMuted]);

  return (
    <UsersStateContext.Provider
      value={{
        streams,
        isMuted,
        isHidden,
        isHost: isHost(router.query.qoraId),
        avatars,
        names,
        sharedScreenTrack,
      }}
    >
      <UsersUpdaterContext.Provider
        value={{
          setIsMuted,
          setIsHidden,
          setAvatars,
          setStreams,
          setNames,
          setSharedScreenTrack,
          muteUser: (id) => socket.emit("host:mute-user", id),
        }}
      >
        {children}
      </UsersUpdaterContext.Provider>
    </UsersStateContext.Provider>
  );
}
