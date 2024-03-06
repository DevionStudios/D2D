import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";
import ConnectHiroWallet from "./ConnectHiroWallet";
import ConnectUnisatWallet from "./ConnectUnisatWallet";
import ConnectDpalWallet from "./ConnectDpalWallet";
// import ConnectMetamask from "./ConnectMetamask";
import HiroImage from "src/assets/hiro wallet.jpg";
import UnisatImage from "src/assets/unisat.png";
import DpalImage from "src/assets/dpal.png";
// import WalletConnectImage from "src/assets/wallet-connect-logo.png";

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
            <ConnectHiroWallet
              image={HiroImage}
              text={text}
              currentUser={currentUser}
              setClose={setClose}
            />
          </div>
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
            style={{
              width: "10.5rem",
              height: "7rem",
              borderRadius: "1rem",
            }}
          >
            <ConnectUnisatWallet
              image={UnisatImage}
              text={text}
              currentUser={currentUser}
              setClose={setClose}
            />
          </div>
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
            style={{
              width: "10.5rem",
              height: "7rem",
              borderRadius: "1rem",
            }}
          >
            <ConnectDpalWallet
              image={DpalImage}
              text={text}
              currentUser={currentUser}
              setClose={setClose}
            />
          </div>
          {/* <div
            className="bg-gradient-to-r from-orange-500 to-orange-300 p-2"
            style={{
              width: "10.5rem",
              height: "7rem",
              borderRadius: "1rem",
            }}
          >
            <ConnectMetamask
              image={WalletConnectImage}
              text={text}
              currentUser={currentUser}
              setClose={setClose}
            />
          </div> */}
        </div>
      </Card.Body>
    </Modal>
  );
}
