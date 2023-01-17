import React, { useEffect } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { ConnectButton, WalletModal } from "@web3uikit/web3";
import { HiOutlineMenu } from "react-icons/hi";
import { useMoralis } from "react-moralis";
import { BiWallet } from "react-icons/bi";

export function TabbedLayout({ navigation, currentUser }) {
  const router = useRouter();

  const [currentPath, setCurrentPath] = useState(router.pathname);
  const [openModal, setOpenModal] = useState(false);
  const [defaultidx, setDefaultIdx] = useState(0);
  const [walletAccount, setWalletAccount] = useState(false);
  const { account, deactivateWeb3, isWeb3Enabled, enableWeb3 } = useMoralis();
  function handleChange(idx) {
    const path = navigation[idx].id;
    if (path == "connectwallet") {
      setCurrentPath(currentPath);
      return;
    }
    setCurrentPath(path);
    setDefaultIdx(idx);
    router.push(path);
  }
  useEffect(() => {
    enableWeb3();
    if (account) setWalletAccount(account);
    else setWalletAccount(account);
    console.log("account", account);
    console.log(isWeb3Enabled);
  }, []);
  return (
    <>
      <Tab.Group
        defaultIndex={
          currentPath === "/feed" ? 0 : currentPath === "/twittertrends" ? 2 : 1
        }
        onChange={(idx) => {
          if (navigation[idx].id == "connectwallet") return;
          handleChange(idx);
        }}
        vertical
      >
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav
            aria-label="Sidebar"
            className="sticky top-20 divide-y divide-gray-300"
          >
            <div className="pb-8 space-y-1">
              {navigation && navigation.length > 0 && (
                <Tab.List className="space-y-2">
                  {navigation.map((item, index) => {
                    if (item.name == "Connect Wallet") {
                      return (
                        <div
                          key={index + 10}
                          className={clsx(
                            account
                              ? " text-blue-600  dark:text-blue-500"
                              : "text-gray-500 hover:text-white hover:text-blue-300 dark:hover:text-blue-400",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full "
                          )}
                        >
                          <span className="truncate flex items-center">
                            <BiWallet
                              className={clsx(
                                "text-gray-400 group-hover:text-black dark:group-hover:text-white text-blue-500",
                                "flex-shrink-0 mr-3 h-6 w-6"
                              )}
                            />
                            <btn
                              onClick={() => {
                                if (!account) {
                                  setOpenModal(true);
                                } else {
                                  deactivateWeb3();
                                }
                              }}
                            >
                              {account
                                ? account.toString().substring(0, 6) +
                                  "..." +
                                  account
                                    .toString()
                                    .substring(
                                      account.toString().length - 4,
                                      account.toString().length
                                    )
                                : "Connect Wallet"}
                            </btn>
                            {openModal && (
                              <WalletModal setIsOpened={setOpenModal} />
                            )}
                          </span>
                        </div>
                      );
                    }
                    if (
                      item.name === "Profile" ||
                      item.name === "Settings" ||
                      item.name === "Messages"
                    ) {
                      if (currentUser.annonymous) return null;
                    }
                    const Icon = item.icon;
                    return (
                      <Tab
                        key={index + 10}
                        className={({ selected }) =>
                          clsx(
                            selected
                              ? " text-blue-600  dark:text-blue-500"
                              : "text-gray-500 hover:text-white hover:text-blue-300 dark:hover:text-blue-400",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full "
                          )
                        }
                      >
                        {({ selected }) => (
                          <span className="truncate flex items-center">
                            <Icon
                              className={clsx(
                                selected
                                  ? "text-blue-700"
                                  : "text-gray-400 group-hover:text-black dark:group-hover:text-white text-blue-500",
                                "flex-shrink-0 mr-3 h-6 w-6"
                              )}
                            />
                            <p>{item.name}</p>
                          </span>
                        )}
                      </Tab>
                    );
                  })}
                </Tab.List>
              )}
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
