import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  HiOutlineCog,
  HiOutlineFire,
  HiOutlineHashtag,
  HiOutlineHome,
  HiOutlineMail,
  HiOutlineNewspaper,
  HiOutlineUser,
} from "react-icons/hi";
import { Feed } from "src/components/Feed";
import { TabbedLayout } from "../Navbar/TabbedLayout";
import { IndeterminateProgress } from "src/components/ui/Progress";
import { Redirect } from "./Redirect";
import { TrendingFeed } from "../../Trending Feed";
import { TwitterFeed } from "../../Twitter Trends";
const RightSidebar = dynamic(async () => {
  const { RightSidebar } = await import("../Navbar/RightSidebar");
  return RightSidebar;
});

RightSidebar.displayName = "RightSidebar";

export function FeedLayout({ currentUser }) {
  const [navigation, setNavigation] = useState([
    {
      component: <Feed currentUser={currentUser} />,
      icon: HiOutlineHome,
      name: "Your Feed",
      id: "/feed",
    },
    {
      component: <TrendingFeed currentUser={currentUser} />,
      icon: HiOutlineHashtag,
      name: "Trending",
      id: "/trending",
    },
    {
      component: <TwitterFeed currentUser={currentUser} />,
      icon: HiOutlineFire,
      name: "Foxxi Trends",
      id: "/twittertrends",
    },
    {
      component: <TwitterFeed currentUser={currentUser} />,
      icon: HiOutlineNewspaper,
      name: "News",
      id: "/news",
    },
    {
      component: <Redirect pageName={"/messages"} />,
      icon: HiOutlineMail,
      name: "Messages",
      id: "/messages",
    },
    {
      component: <Redirect pageName={`/profile/${currentUser.username}`} />,
      icon: HiOutlineUser,
      name: "Profile",
      id: `/profile/${currentUser.username}`,
    },
    {
      component: <Redirect pageName={"/account/settings"} />,
      icon: HiOutlineCog,
      name: "Settings",
      id: "/account/settings",
    },
    {
      name: "Connect Wallet",
      id: "connectwallet",
      component: <Redirect pageName={"/account/settings"} />,
    },
  ]);
  let user = currentUser;
  let loading = false;

  if (loading)
    return (
      <div className="mt-[74px]">
        <IndeterminateProgress />
      </div>
    );

  return (
    <div className="pt-20">
      <div className="max-w-3xl  mx-auto sm:px-6 lg:max-w-full xl:max-w-[90rem] lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-9 lg:grid lg:grid-cols-12 lg:gap-8 ">
          <TabbedLayout
            isTabbed={true}
            navigation={navigation}
            currentUser={currentUser}
          />
        </div>
        <div className=" lg:block lg:col-span-3">
          <RightSidebar currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
