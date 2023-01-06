import React, { useEffect } from "react";
import { WalletSignUp } from "../../components/Auth/WalletSignUp";
import Router from "next/router";
const Signup = ({ currentUser }) => {
  const router = Router;
  return (
    <>
      <WalletSignUp />
    </>
  );
};

export default Signup;
