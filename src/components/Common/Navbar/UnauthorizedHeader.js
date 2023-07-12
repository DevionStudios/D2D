import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { Popover, Transition } from "@headlessui/react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { ThemeToggle } from "src/components/ThemeSwitcher";

import { Button } from "src/components/ui/Button";
import { Heading } from "src/components/ui/Heading";
import Logo from "../../../assets/Foxxi Logo.png";
import FoxxiText from "../../../assets/Foxxi-Text.png";
import { GradientBar } from "src/components/ui/GradientBar";

export function UnauthorizedHeader({ deviceType, CustomLogo }) {
  const router = useRouter();
  return (
    <div className="mb-[-90px]">
      <header>
        <GradientBar
          color="orange"
          size="md"
          className="fixed max-w-full top-0 z-10"
        />
        <Popover className="relative">
          <div
            className={
              "flex justify-between items-center max-w-7xl mx-auto py-4 px-4 lg:px-0 md:justify-start md:space-x-10 "
            }
          >
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/feed" passHref={true}>
                <div className="flex items-center space-x-4">
                  <Image
                    src={CustomLogo || FoxxiText}
                    alt="Foxxi Logo"
                    width={CustomLogo ? 125 : 100}
                    height={CustomLogo ? 150 : 25}
                  />
                </div>
              </Link>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <Popover.Button className=" rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500">
                <span className="sr-only">Open menu</span>
                <HiOutlineMenu className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>

            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <div className="mx-8">{<ThemeToggle />}</div>
              <Button
                href="/auth/walletsignin"
                size="lg"
                className="w-24"
                rounded={"full"}
              >
                Log in
              </Button>
              <Button
                size="lg"
                href="/auth/walletsignup"
                className="ml-8 w-24"
                rounded={"full"}
              >
                Sign up
              </Button>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute bg-white dark:bg-gray-800 z-30 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            >
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5  divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* <Logo />  */}
                      <div
                        className="flex-shrink-0 flex items-center"
                        style={{ position: "relative", right: "20%" }}
                      ></div>
                      <Link href={`/feed`} passHref>
                        <Image
                          src={FoxxiText}
                          alt="Foxxi"
                          width={100}
                          height={30}
                        />
                      </Link>
                      <ThemeToggle />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500">
                        <span className="sr-only">Close menu</span>
                        <HiOutlineX className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <div>
                    <Button
                      className="rounded-full"
                      size="lg"
                      href="/auth/walletsignup"
                      fullWidth
                      rounded={"full"}
                    >
                      Sign up
                    </Button>
                    <p className="mt-6 text-center text-base font-medium text-gray-500">
                      Existing user?{" "}
                      <Link
                        href="/auth/walletsignin"
                        className="text-gray-900 no-underline"
                        rounded={"full"}
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </header>
    </div>
  );
}
