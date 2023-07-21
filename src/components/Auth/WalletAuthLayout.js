import React from "react";
import { Card } from "src/components/ui/Card";
import { Heading } from "src/components/ui/Heading";
import { Footer } from "../Common/Footer";
import { GradientBar } from "../ui/GradientBar";
import Logo from "../../assets/Foxxi Logo.png";
import Image from "next/image";
import { ConnectButton } from "@web3uikit/web3";
import ConnectHiroWallet from "../../components/Wallet/ConnectHiroWallet";
import ConnectDpalWallet from "../../components/Wallet/ConnectDpalWallet";
import ConnectUnisatWallet from "../../components/Wallet/ConnectUnisatWallet";
import { setWalletCookie, resetWalletCookie } from "../../utils/getCookie";
import { MultiWalletModal } from "../../components/Wallet/MultiWalletModal";
import { useState } from "react";
import { useMoralis } from "react-moralis";
export function WalletAuthLayout({ title, subtitle, children, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const { account, deactivateWeb3 } = useMoralis();
  return (
    <main className="flex flex-col justify-center mx-auto w-full max-w-xl min-h-screen py-10">
      <MultiWalletModal
        isOpen={isOpen}
        setClose={setIsOpen}
        text={"dark:font-bold font-bold dark:text-white text-white"}
      ></MultiWalletModal>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center mb-1 space-x-3">
          <Image src={Logo} alt="Foxxi Logo" width={110} height={110} />
          <Heading size="h2">{title}</Heading>
        </div>
        <p className="mt-3 text-gray-500">{subtitle}</p>

        <div className="flex flex-col gap-3 items-center mb-1 space-x-3 my-3">
          <div
            className="inline-flex items-center mb-1 space-x-3 my-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
              style={{
                width: "9.6rem",
                height: "2.6rem",
                borderRadius: "1rem",
              }}
              onClick={(e) => {
                e.preventDefault();
                console.log(document.cookie);
                setIsOpen(true);
              }}
            >
              Connect Wallet
              {/* <ConnectHiroWallet text="text-blue" currentUser={currentUser} /> */}
            </div>
          </div>
          {/* <div
            className="inline-flex items-center mb-1 space-x-3 my-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
              style={{
                width: "9.6rem",
                height: "2.6rem",
                borderRadius: "1rem",
              }}
            >
              <ConnectDpalWallet text={"text-blue"} />
            </div>
          </div> */}
          {/* <div
            className="inline-flex items-center mb-1 space-x-3 my-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
              style={{
                width: "9.6rem",
                height: "2.6rem",
                borderRadius: "1rem",
              }}
            >
              <ConnectUnisatWallet
                text={"text-blue"}
                currentUser={currentUser}
              />
            </div>
          </div> */}
        </div>
      </div>
      <Card
        rounded="md"
        className="overflow-hidden sm:mx-auto sm:w-full sm:max-w-md"
      >
        <GradientBar color="indigo" />
        <Card.Body className="py-5">
          <div>{children}</div>
        </Card.Body>
      </Card>
      <div className="mx-auto">
        <Footer />
      </div>
    </main>
  );
}
