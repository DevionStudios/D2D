import { useRouter } from "next/router";
import { useState } from "react";

import { ROOM_NAME } from "../../constants";
import { createRoomId, createHost } from "../../utils";
import { Navbar } from "src/components/Common/Navbar";

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
        <button
          onClick={createRoom}
          className="p-3 bg-emerald-300 hover:bg-indigo-200 rounded-md text-emerald-800 text-sm founded-medium"
        >
          Create Room
        </button>

        <input
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter or paste room id"
          className="px-4 py-1 w-80 rounded-md"
        />

        <button
          onClick={joinRoom}
          disabled={roomId.length == 0}
          className="p-3 bg-emerald-500 hover:bg-indigo-300 rounded-md text-emerald-800 text-sm founded-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Join
        </button>
      </WelcomeContainer>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <>{page}</>;
};
