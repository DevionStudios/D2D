import { useRouter } from "next/router";
import { useState } from "react";

import { ROOM_NAME } from "../../constants";
import { createRoomId, createHost } from "../../utils";
import { Navbar } from "src/components/Common/Navbar";

import { Button } from "src/components/ui/Button";
import { WelcomeContainer } from "../../components/Conference";

export default function Home({ currentUser }) {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  function createRoom() {
    const roomId = createRoomId();

    createHost(roomId);
    router.push(`/${ROOM_NAME}/${roomId}`);
  }

  function joinRoom() {
    router.push(`/${ROOM_NAME}/${roomId}`);
  }

  return (
    <>
      <Navbar className="pb-10" currentUser={currentUser} />

      <WelcomeContainer currentUser={currentUser}>
        <Button onClick={createRoom} size="xs">
          Create Room
        </Button>

        <input
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter or paste room id"
          className="px-4 py-1 w-80 rounded-md"
        />

        <Button
          onClick={joinRoom}
          disabled={roomId.length == 0}
          className="disabled:cursor-not-allowed"
        >
          Join
        </Button>
      </WelcomeContainer>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <>{page}</>;
};
