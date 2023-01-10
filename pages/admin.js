import React from "react";
import Admin from "../components/Admin/Admin";
import { useEffect } from "react";
import { useRouter } from "next/router";
const AdminPage = (currentUser) => {
  const router = useRouter();
  useEffect(() => {
    if (currentUser.email === undefined) {
      router.push("/auth/access");
    }
  }, []);
  return currentUser?.email ? (
    <Admin currentUser={currentUser} />
  ) : (
    <>
      <h1>Not Authenticated</h1>
    </>
  );
};

export default AdminPage;
