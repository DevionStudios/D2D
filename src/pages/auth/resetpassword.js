import React, { useEffect } from "react";
import Router from "next/router";

import { PasswordReset } from "../../components/Auth/PasswordReset";

const Signin = ({ currentUser }) => {
  const router = Router;
  useEffect(() => {
    if (currentUser.email || currentUser.accountWallet) {
      router.push("/feed");
    }
  }, []);
  return (
    <>
      <PasswordReset />
    </>
  );
};

export default Signin;
