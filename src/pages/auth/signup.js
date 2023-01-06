import React, { useEffect } from "react";
import Router from "next/router";

import { SignUp } from "../../components/Auth/SignUp";

const Signup = ({ currentUser }) => {
  const router = Router;
  useEffect(() => {
    if (currentUser.email || currentUser.accountWallet) {
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
