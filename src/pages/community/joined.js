import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import { Navbar } from "src/components/Common/Navbar";
import { AllCommunities } from "../../components/Community/AllCommunities";

export default function JoinedCommunitiesPage({ currentUser }) {
  const router = useRouter();
  const path = router.pathname;
  return path ? (
    <>
      <Navbar currentUser={currentUser} />
      {/* community tab */}
      <AllCommunities
        currentUser={currentUser}
        isDiscover={router.pathname.includes("discover")}
      />
    </>
  ) : (
    <>
      <div>Loading...</div>
    </>
  );
}

JoinedCommunitiesPage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
