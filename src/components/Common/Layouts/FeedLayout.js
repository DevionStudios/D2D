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
  HiOutlineGlobe,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import { Feed } from "src/components/Feed";
import { TabbedLayout } from "../Navbar/TabbedLayout";
import { IndeterminateProgress } from "src/components/ui/Progress";
import { Redirect } from "./Redirect";
import { TrendingFeed } from "../../Trending Feed";
import { TwitterFeed } from "../../Twitter Trends";
import { News } from "../../News";
import { YourFeed } from "../../YourFeed";
import toast from "react-hot-toast";
const RightSidebar = dynamic(async () => {
  const { RightSidebar } = await import("../Navbar/RightSidebar");
  return RightSidebar;
});

RightSidebar.displayName = "RightSidebar";

export function FeedLayout({ currentUser }) {
  const [hiroWallet, setHiroWallet] = useState(false);

  useEffect(() => {
    if (currentUser) {
      let cookies = document.cookie;
      // check if foxxi_user_wallet cookie exists
      let cookie = cookies.split("foxxi_user_wallet=")?.[1]?.split(";")?.[0];
      console.log(cookie);
      if (cookie) {
        cookie = JSON.parse(cookie);
        if (cookie?.hiroWallet) {
          setHiroWallet(cookie.hiroWallet);
        }
      }
    }
  }, [currentUser]);

  const [navigation, setNavigation] = useState([
    {
      component: <Feed currentUser={currentUser} />,
      icon: HiOutlineGlobeAlt,
      name: "Explore",
      id: "/feed",
    },
    {
      component: <YourFeed currentUser={currentUser} />,
      icon: HiOutlineHome,
      name: "Your Feed",
      id: "/yourfeed",
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
      component: <News currentUser={currentUser} />,
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
      component: (
        <Redirect pageName={`/account/gallery/${currentUser.username}`} />
      ),
      icon: HiOutlineGlobe,
      name: "Web3 Gallery",
      id: `/account/gallery/${currentUser.username}`,
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
      name: "Connect Ethereum Wallet",
      id: "connectwallet",
      component: <Redirect pageName={"/account/settings"} />,
    },
    {
      name: "Connect Hiro Wallet",
      id: "connecthirowallet",
      component: <Redirect pageName={"/account/settings"} />,
    },
    {
      name: "Connect Dpal Wallet",
      id: "connectdpalwallet",
      component: <Redirect pageName={"/account/settings"} />,
    },
    {
      name: "Connect Unisat Wallet",
      id: "connectunisatwallet",
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
