import React from "react";
import dynamic from "next/dynamic";
import { ConnectButton } from "@web3uikit/web3";

import { HiOutlineFire, HiOutlineHashtag, HiOutlineHome } from "react-icons/hi";
import { Feed } from "src/components/Feed";
import { TabbedLayout } from "../Navbar/TabbedLayout";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import { CurrentUser } from "src/components/User/CurrentUser";
// import { useUser } from "src/utils/useUser";
import Spinner from "src/components/ui/Spinner";
import { IndeterminateProgress } from "src/components/ui/Progress";
import { TrendingFeed } from "../../Trending Feed";
import { TwitterFeed } from "../../Twitter Trends";
const RightSidebar = dynamic(async () => {
  const { RightSidebar } = await import("../Navbar/RightSidebar");
  return RightSidebar;
});

RightSidebar.displayName = "RightSidebar";

export function FeedLayout({ currentUser }) {
  const navigation = [
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
      icon: HiOutlineHashtag,
      name: "Foxxi Trends",
      id: "/twittertrends",
    },
  ];
  //   const { user, loading } = useUser();
  let user = currentUser;
  let loading = false;

  if (loading)
    return (
      <div className="mt-[74px]">
        <IndeterminateProgress />
      </div>
    );
  return (
    <div className="py-20">
      <div className="max-w-3xl  mx-auto sm:px-6 lg:max-w-full xl:max-w-[90rem] lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-9 lg:grid lg:grid-cols-12 lg:gap-8 ">
          <TabbedLayout isTabbed={true} navigation={navigation} />
          <div className="hidden lg:block fixed bottom-8">
            <CurrentUser currentUser={currentUser} />
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-3">
          <RightSidebar currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
