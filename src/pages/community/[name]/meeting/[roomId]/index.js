import { useRouter } from "next/router";
import { useState } from "react";

import { Navbar } from "src/components/Common/Navbar";
import Rootpage from "../../../../../components/Conference/RootPage";
import RoomPage from "../../../../../components/Conference/RoomPage";

export default function RoomPageLayout({ currentUser }) {
  const router = useRouter();
  const [unableToSetUser, setUnableToSetUser] = useState(false);
  const communityName = router.query.name;
  const roomId = router.query.roomId;
  const [isBoardActive, setBoardActive] = useState(true);

  return communityName ? (
    <>
      {/* <Navbar currentUser={currentUser} /> */}
      {/* community tab */}
      <RoomPage isBoardActive={isBoardActive} setBoardActive={setBoardActive} />
    </>
  ) : (
    <div>
      <h1>Loading</h1>
    </div>
  );
}

RoomPageLayout.getLayout = function getLayout(page) {
  return <>{page}</>;
};
