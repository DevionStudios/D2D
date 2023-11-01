import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import { Navbar } from "src/components/Common/Navbar";
import { Profile } from "src/components/Profile/Profile";
import { Status } from "src/components/ui/StatusPages/Status";
import { Community } from "../../../components/Community/CommunityHome";
import { AllCommunityUsers } from "../../../components/Community/CommunityMembers";

export default function CommunityMembersPage({ currentUser }) {
  const router = useRouter();
  const communityName = router.query.name;

  return communityName ? (
    <>
      <Navbar currentUser={currentUser} />
      {/* community tab */}
      <AllCommunityUsers currentUser={currentUser} />
    </>
  ) : (
    <div>
      <h1>Loading</h1>
    </div>
  );
}

CommunityMembersPage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
