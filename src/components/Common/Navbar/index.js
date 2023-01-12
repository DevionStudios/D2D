import React, { useState } from "react";
import Image from "next/image";

import { Popover } from "@headlessui/react";
import { HiX, HiMenu } from "react-icons/hi";
import clsx from "clsx";

import { GradientBar } from "src/components/ui/GradientBar";
import { Button } from "src/components/ui/Button";
import { ThemeToggle } from "src/components/ThemeSwitcher";
import { Link } from "src/components/ui/Link";

import { SearchBar } from "./SearchBar";
import { ProfileDropdown } from "./ProfileDropdown";
import { MobileMenu } from "./MobileMenu";
import Spinner from "src/components/ui/Spinner";
import { UnauthorizedHeader } from "./UnauthorizedHeader";
import Logo from "../../../assets/D2D Logo Trans.png";
import { useRouter } from "next/router";
import { HiOutlineBell } from "react-icons/hi";
import { NotificationOverlay } from "src/components/ui/Notifications/NotificationOverlay";

export function Navbar({ currentUser }) {
  const router = useRouter();
  const [openNotifications, setNotificationOpen] = useState(false);
  const user = currentUser;
  if (currentUser?.annonymous === true) {
    return (
      <>
        <UnauthorizedHeader />
      </>
    );
  }

  const signout = () => {
    // clear all cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // redirect to home page
    router.push("/");
  };

  return (
    <>
      <Popover
        as="header"
        className={({ open, close }) =>
          clsx(
            open ? "fixed inset-0 z-40 overflow-y-auto" : "",
            "bg-white dark:bg-gray-900 shadow-sm lg:static lg:overflow-y-visible"
          )
        }
      >
        {({ open, close }) => (
          <>
            <GradientBar
              color="indigo"
              size="sm"
              className="fixed max-w-full top-0 z-10"
            />
            <div className="bg-white/70 dark:bg-black backdrop-blur-md px-4 sm:px-6 lg:px-8 fixed top-0.5 z-10 w-full">
              <div className="mx-auto max-w-7xl relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href={`/feed`}>
                      <Image src={Logo} alt="Foxxi" width={67} height={67} />
                    </Link>
                  </div>
                </div>
                <div className="min-w-0 flex-1  lg:px-0 lg:max-w-5xl xl:col-span-6 flex-grow">
                  <div className="flex items-center px-12 py-4  md:max-w-5xl md:mx-12 lg:mx-10 xl:px-0">
                    <SearchBar />
                  </div>
                </div>

                <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                  <button
                    onClick={() => setNotificationOpen(!openNotifications)}
                    type="button"
                    className="mx-3 ml-auto flex-shrink-0 bg-white dark:bg-gray-800 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <HiOutlineBell className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <HiX className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <HiMenu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
                <div className="hidden  lg:flex lg:items-center lg:justify-end xl:col-span-4 space-x-5">
                  <ThemeToggle />
                  <button
                    onClick={() => setNotificationOpen(!openNotifications)}
                    type="button"
                    className="ml-auto flex-shrink-0 bg-white dark:bg-gray-800 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">View notifications</span>
                    <HiOutlineBell className="h-6 w-6" aria-hidden="true" />
                  </button>
                  {!user ? (
                    <Spinner className="w-5 h-5" />
                  ) : (
                    <ProfileDropdown user={user} />
                  )}
                  <Link
                    href={`/post/new`}
                    className="ml-6 text-sm no-underline"
                  >
                    <Button size="sm">New Post</Button>
                  </Link>
                  <Button size="sm" onClick={signout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
            <NotificationOverlay
              open={openNotifications}
              setOpen={setNotificationOpen}
            />

            <MobileMenu
              user={currentUser}
              open={open}
              closeFx={close}
              signout={signout}
            />
          </>
        )}
      </Popover>
    </>
  );
}
