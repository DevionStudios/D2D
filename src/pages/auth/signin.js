import React, { useEffect } from "react";
import { LoginForm } from "../../components/Auth/SignIn";
import Router from "next/router";
const Signin = ({ currentUser }) => {
  const router = Router;
  useEffect(() => {
    if (currentUser) {
      router.push("/onboarding");
    }
  }, []);
  return (
    <>
      <LoginForm />
    </>
  );
};

export default Signin;
