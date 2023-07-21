import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";
import axios from "axios";
import ConnectHiroWallet from "./ConnectHiroWallet";
import ConnectUnisatWallet from "./ConnectUnisatWallet";
import ConnectDpalWallet from "./ConnectDpalWallet";
import ConnectMetamask from "./ConnectMetamask";
import HiroImage from "src/assets/hiro wallet.jpg";
import UnisatImage from "src/assets/unisat.png";
import DpalImage from "src/assets/dpal.png";
import WalletConnectImage from "src/assets/wallet-connect-logo.png";
import Image from "next/image";

export function MultiWalletModal({ isOpen, setClose, text, currentUser }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setClose(false);
      }}
      className=""
    >
      <Modal.Header dismiss>
        <Heading size="h4">ConnectWallet</Heading>
        <p className="text-sm dark:text-gray-500 text-gray-400">
          Disconnect Previous Wallet Before Connecting A New One
        </p>
      </Modal.Header>
      <Card.Body noPadding className="mt-4">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
            style={{
              width: "10.5rem",
              height: "7rem",
              borderRadius: "1rem",
            }}
          >
            <Image src={HiroImage} alt="Hiro" width={"60%"} height={"60%"} />
            <ConnectHiroWallet text={text} currentUser={currentUser} />
          </div>
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
            style={{
              width: "10.5rem",
              height: "7rem",
              borderRadius: "1rem",
            }}
          >
            <Image src={UnisatImage} alt="Hiro" width={"60%"} height={"60%"} />
            <ConnectUnisatWallet text={text} currentUser={currentUser} />
          </div>
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
            style={{
              width: "10.5rem",
              height: "7rem",
              borderRadius: "1rem",
            }}
          >
            <Image src={DpalImage} alt="Hiro" width={"60%"} height={"60%"} />
            <ConnectDpalWallet text={text} currentUser={currentUser} />
          </div>
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
            style={{
              width: "10.5rem",
              height: "7rem",
              borderRadius: "1rem",
            }}
          >
            <Image
              src={WalletConnectImage}
              alt="Hiro"
              width={"60%"}
              height={"60%"}
            />
            <ConnectMetamask text={text} currentUser={currentUser} />
          </div>
        </div>
      </Card.Body>
    </Modal>
  );
}
