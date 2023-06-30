import React, { useEffect } from "react";

import { SEO } from "src/components/SEO";
import { Hero } from "src/components/Hero";
import { Navbar } from "src/components/Common/Navbar";

import { useDispatch } from "react-redux";
import CustomLogo from "../assets/Foxxi-Final.png";
import {
  setWalletConnectWallet,
  setActiveWallet,
  setBitcoinWallet,
  setDogeWallet,
} from "src/slices/authSlice";
import { getCookieParser } from "next/dist/server/api-utils";
export default function Home({ currentUser, req }) {
  const dispatch = useDispatch();

  console.log("req", req);
  useEffect(() => {
    if (currentUser) {
      // let cookie = getCookieParser("foxxi_jwt");
    }
  }, []);
  return (
    <>
      <SEO
        title="World's First Social Media App Built For Ordinals and Stamps"
        description="Foxxi is a social media platform created for you. See what your friends are up to."
        image="/assets/homepage.png"
        cardType="summary_large_image"
        path="/"
      />
      <div className="min-h-screen overflow-hidden bg-white dark:bg-black ">
        <Navbar currentUser={currentUser} CustomLogo={CustomLogo} />
        <Hero currentUser={currentUser} />
      </div>
    </>
  );
}
