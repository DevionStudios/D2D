import { useRouter } from "next/router";
import { useState } from "react";

import { Navbar } from "src/components/Common/Navbar";
import { Rootpage } from "src/components/Conference/RootPage";

export default function CommunityProfilePage({ currentUser }) {
  const router = useRouter();
  const [unableToSetUser, setUnableToSetUser] = useState(false);
  const communityName = router.query.name;

  return communityName ? (
    <>
      <Navbar currentUser={currentUser} />
      {/* community tab */}
      <Rootpage currentUser={currentUser} communityName={communityName} />
    </>
  ) : (
    <div>
      <h1>Loading</h1>
    </div>
  );
}

CommunityProfilePage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
