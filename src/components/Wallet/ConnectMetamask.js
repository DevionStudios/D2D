import React, { useEffect, useState } from "react";
import { WalletModal } from "@web3uikit/web3";
import { useMoralis } from "react-moralis";
import Image from "next/image";
import { getWalletCookie } from "src/utils/getCookie";
import { toast } from "react-hot-toast";
const ConnectMetamask = ({ text, currentUser, image }) => {
  const { account, deactivateWeb3 } = useMoralis();
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      {image ? <Image src={image} alt="Dpal" width={30} height={30} /> : null}
      {openModal && <WalletModal setIsOpened={setOpenModal} />}
      <button
        className={text || ""}
        onClick={() => {
          if (!account) {
            setOpenModal(true);
          } else {
            deactivateWeb3();
          }
        }}
      >
        {account ? account?.toString()?.slice(0, 5) : "Connect Eth Wallet"}
        {account ? "..." : null}
      </button>
    </div>
  );
};

export default ConnectMetamask;
