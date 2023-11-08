import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import { Navbar } from "src/components/Common/Navbar";
import { Profile } from "src/components/Profile/Profile";
import { Status } from "src/components/ui/StatusPages/Status";
import { Community } from "../../../components/Community/CommunityHome";

export default function CommunityProfilePage({ currentUser }) {

  useEffect(() => {
    console.log(communityName);
  }, []);

  const router = useRouter();
  const [unableToSetUser, setUnableToSetUser] = useState(false);
  const communityName = router.query.name;

  return communityName ? (
    <>
      <Navbar currentUser={currentUser} />
      {/* community tab */}
      <Community currentUser={currentUser} communityName={communityName} />
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
