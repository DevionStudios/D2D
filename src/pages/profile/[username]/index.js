import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Navbar } from "~/components/Common/Navbar";
import { Profile } from "~/components/Profile/Profile";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage({ currentUser }) {
  const [user, setUser] = useState(undefined);
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
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  return user ? (
    <Profile
      isMe={user.username == currentUser.username}
      user={user}
      currentUser={currentUser}
      username={username}
    />
  ) : (
    <>Loading</>
  );
}

ProfilePage.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar />
      {page}
    </>
  );
};
