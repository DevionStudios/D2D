import { Navbar } from "~/components/Common/Navbar";
import React from "react";
import { Hero } from "~/components/Hero";
import { SEO } from "~/components/SEO";

export default function Home({ currentUser }) {
  return (
    <>
      <SEO
        title="D2D | Capture and share the world's moments"
        description="D2D is a social media platform created for you. See what your friends are up to."
        image="https://i.imgur.com/ni5JNk1.png"
        cardType="summary_large_image"
        path="/"
      />
      <div className="min-h-screen overflow-hidden bg-white dark:bg-gray-900 ">
        <Navbar currentUser={currentUser} />
        <Hero />
      </div>
    </>
  );
}
