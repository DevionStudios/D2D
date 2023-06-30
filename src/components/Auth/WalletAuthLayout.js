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
import { setWalletCookie } from "../../utils/getCookie";
export function WalletAuthLayout({ title, subtitle, children }) {
  return (
    <main className="flex flex-col justify-center mx-auto w-full max-w-xl min-h-screen py-10">
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
              setWalletCookie(document, { walletType: "walletConnect" });
            }}
          >
            <ConnectButton />
          </div>
          <div
            className="inline-flex items-center mb-1 space-x-3 my-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div
              className="bg-red-600 p-2"
              style={{
                width: "9.6rem",
                height: "2.6rem",
                borderRadius: "1rem",
              }}
            >
              <ConnectHiroWallet />
            </div>
          </div>
          <div
            className="inline-flex items-center mb-1 space-x-3 my-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div
              className="bg-red-600 p-2"
              style={{
                width: "9.6rem",
                height: "2.6rem",
                borderRadius: "1rem",
              }}
            >
              <ConnectDpalWallet />
            </div>
          </div>
          <div
            className="inline-flex items-center mb-1 space-x-3 my-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div
              className="bg-red-600 p-2"
              style={{
                width: "9.6rem",
                height: "2.6rem",
                borderRadius: "1rem",
              }}
            >
              <ConnectUnisatWallet />
            </div>
          </div>
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
