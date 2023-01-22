import React from "react";
import Notification from "../components/Notification";
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
    <Notification currentUser={currentUser} />
  ) : (
    <>
      <h1>Not Authenticated</h1>
    </>
  );
};

export default NotificationPage;
