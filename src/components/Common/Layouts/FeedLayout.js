import React from "react";
import dynamic from "next/dynamic";
import { ConnectButton } from "@web3uikit/web3";

import { HiOutlineFire, HiOutlineHashtag, HiOutlineHome } from "react-icons/hi";
import { Feed } from "~/components/Feed";
import { TabbedLayout } from "../Navbar/TabbedLayout";
import { LoadingFallback } from "~/components/ui/Fallbacks/LoadingFallback";
import { CurrentUser } from "~/components/User/CurrentUser";
// import { useUser } from "~/utils/useUser";
import Spinner from "~/components/ui/Spinner";
import { IndeterminateProgress } from "~/components/ui/Progress";

const RightSidebar = dynamic(
  async () => {
    const { RightSidebar } = await import("../Navbar/RightSidebar");
    return RightSidebar;
  },
  { loading: () => <LoadingFallback />, ssr: true }
);

RightSidebar.displayName = "RightSidebar";

export const navigation = [
  {
    component: <Feed />,
    icon: HiOutlineHome,
    name: "Your Feed",
    id: "all",
  },
  {
    component: <Feed />, //! Replace with Popular Posts later
    icon: HiOutlineFire,
    name: "Popular",
    id: "popular",
  },
  {
    component: <Feed />, //! Replace with trending posts later
    icon: HiOutlineHashtag,
    name: "Trending",
    id: "trending",
  },
];

export function FeedLayout() {
  //   const { user, loading } = useUser();
  let user = {
    avatar: "https://placekitten.com/400/400",
    username: "kitten",
    name: "Kitten",
  };
  let loading = false;

  if (loading || !user)
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
            <CurrentUser
              avatar={user.avatar || "https://placekitten.com/400/400"}
              name={user.name || "Kitten"}
              username={user.username || "kitten"}
            />
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-3">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
