import { GetServerSideProps } from "next";
import { Follows } from "src/components/Profile/Follows";

import { useRouter } from "next/router";
import { useEffect } from "react";

const FollowPage = ({ currentUser }) => {
  return <Follows currentUser={currentUser} />;
};

export default FollowPage;
