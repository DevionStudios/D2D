import React from "react";
import {
  HiOutlineKey,
  HiOutlineSparkles,
  HiOutlineUserCircle,
} from "react-icons/hi";

import { EditProfileTab } from "src/components/Profile/EditProfileTab";
import { PasswordTab } from "src/components/Profile/Password";
import { Preferences } from "src/components/Profile/Preferences";
import { ImportTweetsTab } from "src/components/Profile/ImportTweetsTab";
import { TabbedLayout } from "../Navbar/TabbedLayout";

export function AccountPageLayout({ currentUser }) {
  return (
    <div className="max-w-7xl mt-20 mx-auto">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <TabbedLayout
          navigation={[
            {
              component: <EditProfileTab currentUser={currentUser} />,
              icon: HiOutlineUserCircle,
              name: "Profile Settings",
              id: "",
            },
            {
              component: <PasswordTab />,
              icon: HiOutlineKey,
              name: "Security Settings",
              id: "",
            },
            {
              component: <Preferences />,
              icon: HiOutlineSparkles,
              name: "Options",
              id: "",
            },
            {
              component: <ImportTweetsTab />,
              icon: HiOutlineSparkles,
              name: "Tweets Migration",
              id: "",
            },
          ]}
          isTabbed={true}
        />
      </div>
    </div>
  );
}
