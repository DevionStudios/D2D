import React, { useEffect, useState } from "react";
import { WalletModal } from "@web3uikit/web3";
import { useMoralis } from "react-moralis";
import Image from "next/image";
import { toast } from "react-hot-toast";
const ConnectMetamask = ({ text, currentUser, image, setClose }) => {
  const { account, deactivateWeb3 } = useMoralis();
  const [openModal, setOpenModal] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked && account) {
      toast.success("Connected to Ethereum Wallet");
      setIsClicked(false);
      setClose(false);
    }
  }, [account]);

  return (
    <button
      className={text || ""}
      onClick={() => {
        if (!account) {
          setOpenModal(true);
          setIsClicked(true);
        } else {
          deactivateWeb3();
        }
      }}
    >
      {image ? (
        <Image src={image} alt="Dpal" width={"60%"} height={"60%"} />
      ) : null}
      <br />
      {openModal && <WalletModal setIsOpened={setOpenModal} />}
      {account ? account?.toString()?.slice(0, 5) : "Connect Eth Wallet"}
      {account ? "..." : null}
    </button>
  );
};

export default ConnectMetamask;
