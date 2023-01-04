import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Navbar } from "src/components/Common/Navbar";
import { Profile } from "src/components/Profile/Profile";
import { useEffect, useState } from "react";
import axios from "axios";

import { Status } from "src/components/ui/StatusPages/Status";

export default function ProfilePage({ currentUser }) {
  const [user, setUser] = useState(undefined);
  const [unableToSetUser, setUnableToSetUser] = useState(false);
  let isMe = false;
  const router = useRouter();
  const username = router.query.username;
  console.log(username);
  const fetchUserProfile = async function () {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/users/otheruser/${username}`
      );
      setUser(data);
      console.log("profile page data:", data);
    } catch (error) {
      setUnableToSetUser(true);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  return unableToSetUser ? (
    <Status statusCode="404" href={!currentUser ? "/" : "/feed/"} />
  ) : user ? (
    <>
      <Navbar currentUser={currentUser} />
      <Profile
        isMe={user.username == currentUser.username}
        user={user}
        currentUser={currentUser}
        username={username}
      />
    </>
  ) : (
    <div>
      <h1>Loading</h1>
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
