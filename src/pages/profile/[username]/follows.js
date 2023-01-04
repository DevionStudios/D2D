import { GetServerSideProps } from "next";
import { Follows } from "src/components/Profile/Follows";
const FollowPage = ({ currentUser }) => {
  return <Follows currentUser={currentUser} />;
};

export default FollowPage;
