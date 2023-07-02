import React, { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { HiOutlineCog, HiOutlineHome, HiOutlineSparkles } from "react-icons/hi";
import { Button } from "src/components/ui/Button";
import { Link } from "src/components/ui/Link";
import { useRouter } from "next/router";
import BitVerseLogo from "../../../assets/thumb_Bitverse-Png.png";
import Image from "next/image";
import ButtonOrLink from "src/components/ui/ButtonOrLink";

export const links = [
  {
    href: (username) => `/profile/${username}`,
    label: "Your Profile",
    icon: HiOutlineSparkles,
  },
  {
    href: "/feed",
    label: "Home",
    icon: HiOutlineHome,
  },
  {
    href: "/account/settings",
    label: "Profile Settings",
    icon: HiOutlineCog,
  },
];

export function MobileMenu({
  open,
  user,
  closeFx,
  signout,
  CreatePostModalOpen,
  setCreatePostModalOpen,
  createStoryModalOpen,
  setCreateStoryModalOpen,
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Transition
        show={open}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel
          as="nav"
          className="lg:hidden flex flex-col justify-between h-full"
          aria-label="Global"
        >
          <div className="border-t border-gray-200 pt-4 pb-3 mt-16">
            <Link
              href={`/profile/${user?.username}`}
              className="inline-block no-underline"
            >
              <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.image}
                    height={40}
                    width={40}
                    alt={`Profile picture of ${user?.name}`}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-100">
                    Hi! {user?.name}
                  </div>
                </div>
              </div>
            </Link>
            <div className="mt-3 px-2 space-y-1">
              {links.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <ButtonOrLink
                    key={idx}
                    onClick={() => {
                      closeFx();
                      router.push(
                        typeof link.href === "function"
                          ? link.href(user?.username)
                          : link.href,
                        undefined,
                        { shallow: true }
                      );
                    }}
                    className="flex no-underline px-3 py-2 rounded-md text-base  hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span className="space-x-2 flex">
                      <Icon className="h-6 w-6" /> <span>{link.label}</span>
                    </span>
                  </ButtonOrLink>
                );
              })}
            </div>
            <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
              <Button
                className="mt-2"
                fullWidth
                onClick={() => {
                  closeFx();
                  setCreatePostModalOpen(true);
                }}
                size="lg"
              >
                New Post
              </Button>
            </div>
            <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
              <Button
                className="mt-2"
                fullWidth
                onClick={() => {
                  closeFx();
                  setCreateStoryModalOpen(true);
                }}
                size="lg"
              >
                New Story
              </Button>
            </div>
            <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
              <Button className="mt-2" fullWidth size="lg">
                <Image
                  src={BitVerseLogo}
                  alt="BitVerse"
                  width={120}
                  height={24}
                ></Image>
              </Button>
            </div>
          </div>
          <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
            <Button
              variant="dark"
              className="mt-2"
              fullWidth
              href="#"
              size="lg"
              onClick={() => signout()}
            >
              Sign Out
            </Button>
          </div>
        </Popover.Panel>
      </Transition>
    </>
  );
}
