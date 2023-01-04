import React from "react";
import {
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineSparkles,
} from "react-icons/hi";
import { Menu, MenuItem } from "src/components/ui/Dropdown";

export function ProfileDropdown({ user }) {
  const signout = () => {};
  return (
    <Menu
      dropdown={
        <>
          <MenuItem href={"/feed"} icon={<HiOutlineHome className="w-5 h-5" />}>
            Home
          </MenuItem>
          <MenuItem
            href={`/profile/${user.username}`}
            icon={<HiOutlineSparkles className="w-5 h-5" />}
          >
            My Profile
          </MenuItem>
          <MenuItem
            href={`/account/settings`}
            icon={<HiOutlineCog className="w-5 h-5" />}
          >
            Profile settings
          </MenuItem>
          <MenuItem
            onClick={() => signout()}
            icon={<HiOutlineLogout className="w-5 h-5" />}
          >
            Signout
          </MenuItem>
        </>
      }
      dropdownClassName="mr-5 mt-6"
    ></Menu>
  );
}
