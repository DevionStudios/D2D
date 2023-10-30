import axios from "axios";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Navbar } from "src/components/Common/Navbar";
import { FeedLayout } from "../../components/Common/Layouts/FeedLayout";
export default function CommunityPage({ currentUser }) {
  const router = useRouter();
  return (
    <>
      <Navbar currentUser={currentUser} />
      <FeedLayout />
    </>
  );
}

CommunityPage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
