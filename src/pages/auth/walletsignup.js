import React from "react";

import { WalletSignUp } from "../../components/Auth/WalletSignUp";
import { useEffect } from "react";
import { resetWalletCookie } from "../../utils/getCookie";

const Signup = ({ currentUser }) => {
  useEffect(() => {
    resetWalletCookie(document);
    // if (document.cookie.includes("foxxi_jwt")) {
    //   // clear all cookies
    //   document.cookie.split(";").forEach(function (c) {
    //     document.cookie = c
    //       .replace(/^ +/, "")
    //       .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    //   });
    // }
  }, []);
  return (
    <>
      <WalletSignUp currentUser={currentUser} />
    </>
  );
};

export default Signup;
