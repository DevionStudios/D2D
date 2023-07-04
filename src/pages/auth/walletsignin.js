import React from "react";

import { WalletSignIn } from "../../components/Auth/WalletSignIn";
import { useEffect } from "react";

const Signin = ({ currentUser }) => {
  useEffect(() => {
    if (document.cookie.includes("foxxi_jwt")) {
      // clear all cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
  }, []);
  return (
    <>
      <WalletSignIn currentUser={currentUser} />
    </>
  );
};

export default Signin;
