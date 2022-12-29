import React, { useEffect } from "react";
import { SignUp } from "../../components/Auth/SignUp";
import Router from "next/router";
const Signup = ({ currentUser }) => {
  const router = Router;
  useEffect(() => {
    if (currentUser) {
      router.push("/onboarding");
    }
  }, []);
  return (
    <>
      <SignUp />
    </>
  );
};

export default Signup;
