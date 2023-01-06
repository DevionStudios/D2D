import React, { useEffect } from "react";
import Router from "next/router";

import { LoginForm } from "../../components/Auth/SignIn";

const Signin = ({ currentUser }) => {
  const router = Router;
  useEffect(() => {
    if (currentUser.email || currentUser.accountWallet) {
      router.push("/feed");
    }
  }, []);
  return (
    <>
      <LoginForm />
    </>
  );
};

export default Signin;
