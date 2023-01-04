import { ThemeToggle } from "../ThemeSwitcher";
import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";
import { Button } from "../ui/Button";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import FoxxiToken from "../../constants/ABIs/FoxxiToken.json";
import networkMapping from "../../constants/networkMapping.json";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

export function Preferences() {
  const { account, chainId } = useMoralis();
  const [isDisabled, setIsDisabled] = useState(false);
  const claimToken = async () => {
    const networkChainId = chainId?.toString().split("0x")[1] || "5";
    try {
      const response = await axios.get(
        "https://foxxi-backend.onrender.com/api/reward/check",
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response.data);
      const hasClaimed = response.data.hasClaimed;
      if (hasClaimed) {
        toast.error("You have already claimed the token!");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const owner = provider.getSigner(
          process.env.NEXT_PUBLIC_TOKEN_DEPLOYER_PUBLIC_ADDRESS
        );
        console.log("reward", process.env.NEXT_PUBLIC_SIGN_UP_REWARD);
        const FoxxiTokenContract = new ethers.Contract(
          networkMapping[networkChainId]["FoxxiToken"].slice(-1)[0],
          FoxxiToken,
          signer
        );
        console.log("owneraddress", (await owner.getAddress()).toString());
        console.log("recieveraddress", (await signer.getAddress()).toString());
        const receiverWalletAddress = (await signer.getAddress()).toString();
        const ownerWalletAddress = (await owner.getAddress()).toString();
        let tx = await FoxxiTokenContract.transferFromCustom(
          ownerWalletAddress,
          receiverWalletAddress,
          ethers.utils.parseEther(process.env.NEXT_PUBLIC_SIGN_UP_REWARD),
          {
            gasLimit: 500000,
          }
        );
        await tx.wait();

        const response2 = await axios.get(
          "https://foxxi-backend.onrender.com/api/reward/claim",
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
        console.log(response2.data);
        toast.success("Reward claimed successfully!");
      }
    } catch (e) {
      toast.error("Something went wrong! Please try again later.");
      console.log(e);
    } finally {
      setIsDisabled(false);
    }
  };
  return (
    <Card rounded="lg" className="lg:max-w-3xl">
      <Card.Body>
        <Heading size="h3">Preferences</Heading>
        <p className="text-muted text-sm">
          Adjust these setting according to your needs. Such as Dark Mode.
        </p>

        <div className="container pt-5 space-y-6 mx-auto">
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <label className="text-sm font-medium dark:text-white text-gray-900">
                Dark Mode
              </label>
              <span className="text-sm text-muted">
                Change to light or dark mode.
              </span>
            </span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <label className="text-sm font-medium dark:text-white text-gray-900">
                Claim Tokens
              </label>
              <span className="text-sm text-muted">Claim free tokens</span>
            </span>
            <Button
              size="sm"
              variant="solid"
              onClick={() => {
                setIsDisabled(true);
                claimToken();
              }}
              disabled={isDisabled}
            >
              Claim Token{" "}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
