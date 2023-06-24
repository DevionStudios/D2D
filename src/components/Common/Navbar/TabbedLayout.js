import React, { useEffect } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { ConnectButton, WalletModal } from "@web3uikit/web3";
import { HiOutlineMenu } from "react-icons/hi";
import { useMoralis } from "react-moralis";
import { BiWallet } from "react-icons/bi";
import { useConnect } from "@stacks/connect-react";
import ConnectHiroWallet from "src/components/Wallet/ConnectHiroWallet";
import ConnectDpalWallet from "src/components/Wallet/ConnectDpalWallet";
import ConnectUnisatWallet from "src/components/Wallet/ConnectUnisatWallet";
export function TabbedLayout({ navigation, currentUser }) {
  const router = useRouter();

  const [currentPath, setCurrentPath] = useState(router.pathname);
  const [openModal, setOpenModal] = useState(false);
  const [defaultidx, setDefaultIdx] = useState(0);
  const [walletAccount, setWalletAccount] = useState(false);
  const { account, deactivateWeb3, isWeb3Enabled, enableWeb3 } = useMoralis();
  const [deviceType, setDeviceType] = useState("");
  useEffect(() => {
    let hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
      } else if ("orientation" in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }
    if (hasTouchScreen) {
      setDeviceType("Mobile");
    } else {
      setDeviceType("Desktop");
    }
  }, []);

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
    // console.log("account", account);
    console.log(isWeb3Enabled);
  }, []);
  return deviceType !== "Mobile" ? (
    <>
      <Tab.Group
        defaultIndex={
          currentPath === "/feed"
            ? 0
            : currentPath === "/yourfeed"
            ? 1
            : currentPath === "/trending"
            ? 2
            : currentPath === "/twittertrends"
            ? 3
            : 4
        }
        onChange={(idx) => {
          if (
            navigation[idx].id == "connectwallet" ||
            navigation[idx].id == "connecthirowallet" ||
            navigation[idx].id == "connectdpalwallet" || 
            navigation[idx].id == "connectunisatwallet"
          )
            return;
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
                    if (item.name == "Connect Ethereum Wallet") {
                      return (
                        <div
                          key={index + 10}
                          className={clsx(
                            account
                              ? " text-brand-600  dark:text-brand-500"
                              : "hover:text-brand-300 dark:hover:text-brand-400",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full "
                          )}
                        >
                          <span className="truncate flex items-center linksText">
                            <BiWallet
                              className={clsx(
                                " group-hover:text-black dark:group-hover:text-white text-brand-500",
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
                                : "Connect Eth Wallet"}
                            </btn>
                            {openModal && (
                              <WalletModal setIsOpened={setOpenModal} />
                            )}
                          </span>
                        </div>
                      );
                    }
                    if (item.name == "Connect Hiro Wallet") {
                      return (
                        <div
                          key={index + 10}
                          className={clsx(
                            account
                              ? " text-brand-600  dark:text-brand-500"
                              : "hover:text-brand-300 dark:hover:text-brand-400",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full "
                          )}
                        >
                          <span className="truncate flex items-center linksText">
                            <BiWallet
                              className={clsx(
                                " group-hover:text-black dark:group-hover:text-white text-brand-500",
                                "flex-shrink-0 mr-3 h-6 w-6"
                              )}
                            />
                            <ConnectHiroWallet />
                          </span>
                        </div>
                      );
                    }
                    if (item.name == "Connect Dpal Wallet") {
                      return (
                        <div
                          key={index + 10}
                          className={clsx(
                            account
                              ? " text-brand-600  dark:text-brand-500"
                              : "hover:text-brand-300 dark:hover:text-brand-400",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full "
                          )}
                        >
                          <span className="truncate flex items-center linksText">
                            <BiWallet
                              className={clsx(
                                " group-hover:text-black dark:group-hover:text-white text-brand-500",
                                "flex-shrink-0 mr-3 h-6 w-6"
                              )}
                            />
                            {/* {"Connect Dpal"} */}
                            <ConnectDpalWallet />
                          </span>
                        </div>
                      );
                    }
                    if (item.name == "Connect Unisat Wallet") {
                      return (
                        <div
                          key={index + 10}
                          className={clsx(
                            account
                              ? " text-brand-600  dark:text-brand-500"
                              : "hover:text-brand-300 dark:hover:text-brand-400",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full "
                          )}
                        >
                          <span className="truncate flex items-center linksText">
                            <BiWallet
                              className={clsx(
                                " group-hover:text-black dark:group-hover:text-white text-brand-500",
                                "flex-shrink-0 mr-3 h-6 w-6"
                              )}
                            />
                            <ConnectUnisatWallet />
                            {/* {"Connect Unisat"} */}
                          </span>
                        </div>
                      );
                    }
                    if (
                      item.name === "Profile" ||
                      item.name === "Settings" ||
                      item.name === "Messages" ||
                      item.name === "Your Feed"
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
                              ? " text-brand-600  dark:text-brand-500"
                              : "text-gray-500 hover:text-brand-300 dark:hover:text-brand-400",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full "
                          )
                        }
                      >
                        {({ selected }) => (
                          <span className="truncate flex items-center">
                            <Icon
                              className={clsx(
                                selected
                                  ? "text-brand-700"
                                  : " group-hover:text-black dark:group-hover:text-white text-brand-500",
                                "flex-shrink-0 mr-3 h-6 w-6"
                              )}
                            />
                            <p className="linksText">{item.name}</p>
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
  ) : (
    <>
      <Tab.Group
        defaultIndex={
          currentPath === "/feed"
            ? 0
            : currentPath === "/yourfeed"
            ? 1
            : currentPath === "/trending"
            ? 2
            : currentPath === "/twittertrends"
            ? 3
            : 4
        }
        onChange={(idx) => {
          if (navigation[idx].id == "connectwallet") return;
          handleChange(idx);
        }}
      >
        <div className="w-full">
          <section
            id="bottom-navigation"
            className="block fixed inset-x-0 bottom-0 z-10"
          >
            <div id="tabs" className="">
              {navigation && navigation.length > 0 && (
                <Tab.List className="flex flex-row">
                  {navigation.map((item, index) => {
                    const Icon = item.icon;

                    if (item.name === "Messages" || item.name === "Your Feed") {
                      if (currentUser.annonymous) return null;
                    }

                    if (
                      item.name !== "Connect Wallet" &&
                      item.name !== "Profile" &&
                      item.name !== "Settings"
                    ) {
                      return (
                        <>
                          <Tab
                            key={index}
                            className="dark:bg-black bg-slate-200 flex flex-grow"
                          >
                            {({ selected }) => (
                              <span className="w-full focus:text-teal-500 hover:text-teal-500 justify-center  text-center pt-2 pb-1">
                                <Icon
                                  className={
                                    selected
                                      ? "inline-block pb-1 text-brand-800 h-9 w-9"
                                      : "inline-block pb-1 dark:text-white text-gray-800 h-9 w-9"
                                  }
                                />
                              </span>
                            )}
                          </Tab>
                        </>
                      );
                    }
                  })}
                </Tab.List>
              )}
            </div>
          </section>
        </div>
        <Tab.Panels className="">
          {navigation.map((panel, index) => {
            return <Tab.Panel key={index}>{panel.component}</Tab.Panel>;
          })}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
