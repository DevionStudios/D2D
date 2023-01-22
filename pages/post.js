import React from "react";
import Post from "../components/Post";
import { useEffect } from "react";
import { useRouter } from "next/router";
const NotificationPage = ({ currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    if (currentUser.email === undefined) {
      router.push("/auth/access");
    }
  }, []);

  return currentUser?.email ? (
    <Post currentUser={currentUser} />
  ) : (
    <>
      <h1>Not Authenticated</h1>
    </>
  );
};

export default NotificationPage;
