import React from "react";

import { WalletSignUp } from "../../components/Auth/WalletSignUp";
import { useEffect } from "react";

const Signup = ({ currentUser }) => {
  // useEffect(() => {
  //   if (document.cookie.includes("foxxi_jwt")) {
  //     // clear all cookies
  //     document.cookie.split(";").forEach(function (c) {
  //       document.cookie = c
  //         .replace(/^ +/, "")
  //         .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  //     });
  //   }
  // }, []);
  return (
    <>
      <WalletSignUp currentUser={currentUser} />
    </>
  );
};

export default Signup;
