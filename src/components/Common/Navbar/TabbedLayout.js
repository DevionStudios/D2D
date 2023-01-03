import React from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { IconType } from "react-icons/lib";
import { useState, useEffect } from "react";
import { ConnectButton } from "@web3uikit/web3";
import { HiOutlineFire, HiOutlineHashtag, HiOutlineHome } from "react-icons/hi";
import { RiWallet3Fill } from "react-icons/ri";

export function TabbedLayout({ navigation }) {
  const router = useRouter();

  const [currentPath, setCurrentPath] = useState(router.pathname);
  const [defaultidx, setDefaultIdx] = useState(0);
  function handleChange(idx) {
    console.log("route_path," + currentPath);
    const path = navigation[idx].id;
    setCurrentPath(path);
    setDefaultIdx(idx);
    router.push(path);
  }

  return (
    <>
      <Tab.Group
        defaultIndex={
          currentPath === "/feed" ? 0 : currentPath === "/twittertrends" ? 2 : 1
        }
        onChange={(idx) => handleChange(idx)}
        vertical
      >
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav
            aria-label="Sidebar"
            className="sticky top-20 divide-y divide-gray-300"
          >
            <div className="pb-8 space-y-1">
              <Tab.List className="space-y-2">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Tab
                      key={index + 10}
                      className={({ selected }) =>
                        clsx(
                          selected
                            ? "bg-brand-800 text-white dark:bg-brand-700   dark:text-white"
                            : "text-gray-600 hover:text-white hover:bg-brand-600 dark:hover:bg-yellow-300 dark:hover:text-gray-100",
                          "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full "
                        )
                      }
                    >
                      {({ selected }) => (
                        <span className="truncate flex items-center">
                          <Icon
                            className={clsx(
                              selected
                                ? "text-white"
                                : "text-gray-400 group-hover:text-white dark:group-hover:text-white",
                              "flex-shrink-0 mr-3 h-6 w-6"
                            )}
                          />
                          <p>{item.name}</p>
                        </span>
                      )}
                    </Tab>
                  );
                })}
                <div className="h-16 w-30 bg-white rounded-lg">
                  <span className="truncate flex items-center">
                    <RiWallet3Fill className="text-gray-800 group-hover:text-white dark:group-hover:text-white flex-shrink-0 h-6 w-6" />
                    <ConnectButton />
                  </span>
                </div>
              </Tab.List>
            </div>
          </nav>
        </aside>
        <Tab.Panels className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {navigation.map((panel, index) => {
            return <Tab.Panel key={index}>{panel.component}</Tab.Panel>;
          })}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
