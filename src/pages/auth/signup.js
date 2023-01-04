import React, { useEffect } from "react";
import { SignUp } from "../../components/Auth/SignUp";
import Router from "next/router";
const Signup = ({ currentUser }) => {
  const router = Router;
  useEffect(() => {
    if (currentUser.email) {
      router.push("/feed");
    }
  }, []);
  return (
    <>
      <SignUp />
    </>
  );
};

export default Signup;
