import React from "react";

import { SEO } from "src/components/SEO";
import { Hero } from "src/components/Hero";
import { Navbar } from "src/components/Common/Navbar";

export default function Home({ currentUser }) {
  return (
    <>
      <SEO
        title="Foxxi | Capture and share the world's moments"
        description="Foxxi is a social media platform created for you. See what your friends are up to."
        image="/assets/homepage.png"
        cardType="summary_large_image"
        path="/"
      />
      <div className="min-h-screen overflow-hidden bg-white dark:bg-black ">
        <Navbar currentUser={currentUser} />
        <Hero />
      </div>
    </>
  );
}
