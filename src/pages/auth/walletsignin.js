import React, { useEffect } from "react";
import { WalletSignIn } from "../../components/Auth/WalletSignIn";
import Router from "next/router";
const Signin = ({ currentUser }) => {
  const router = Router;
  return (
    <>
      <WalletSignIn />
    </>
  );
};

export default Signin;
