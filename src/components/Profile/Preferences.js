import { ThemeToggle } from "../ThemeSwitcher";
import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";
import { Button } from "../ui/Button";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import FoxxiToken from "../../constants/ABIs/FoxxiToken.json";
import IpfsNFTABI from "../../constants/ABIs/IpfsNFT.json";
import networkMapping from "../../constants/networkMapping.json";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { FileInput } from "../ui/Form/FileInput";
import { object, z } from "zod";
import Form, { useZodForm } from "../ui/Form/Form";
import { useRouter } from "next/router";
import { Input } from "../ui/Input";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { getCookie, getWalletCookie } from "src/utils/getCookie";

export function Preferences({ currentUser }) {
  const [haveNFT, setHaveNFT] = useState(false);
  const { account, chainId } = useMoralis();
  const [isDisabled, setIsDisabled] = useState(false);
  const [NFTMintDisabled, setNFTMintDisabled] = useState(false);
  const [fileImg, setFileImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ImageFormSchema = object({
    image: z.any(),
    ipfsUrl: z.any(),
  });

  const form = useZodForm({
    schema: ImageFormSchema,
    defaultValues: {},
  });

  const claimToken = async () => {
    const networkChainId = chainId?.toString().split("0x")[1] || "5";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reward/check`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      const hasClaimed = response.data.hasClaimed;
      if (hasClaimed) {
        toast.error("You have already claimed the token!");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const owner = provider.getSigner(
          process.env.NEXT_PUBLIC_TOKEN_DEPLOYER_PUBLIC_ADDRESS
        );
        const FoxxiTokenContract = new ethers.Contract(
          networkMapping[networkChainId]["FoxxiToken"].slice(-1)[0],
          FoxxiToken,
          signer
        );
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/reward/claim`,
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
        toast.success("Reward claimed successfully!");
      }
    } catch (e) {
      toast.error(
        "Something went wrong! Please check if your wallet is connected!"
      );
    } finally {
      setIsDisabled(false);
    }
  };

  const sendFileToIPFS = async ({ variables }) => {
    const { input } = variables;
    const { image: fileImg } = input;
    const networkChainId = chainId?.toString().split("0x")[1] || "5";

    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        toast.success(`Image sent to ipfs.`);

        const resMeta = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: {
            name: fileImg.name,
            image: ImgHash,
          },
          headers: {
            pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
            "Content-Type": "application/json",
          },
        });

        const MetaHash = `ipfs://${resMeta.data.IpfsHash}`;
        toast.success(`MetaData sent to ipfs.`);

        // Calling the contract function to mint the NFT
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const IpfsNFT = new ethers.Contract(
          networkMapping[networkChainId]["IpfsNFT"].slice(-1)[0],
          IpfsNFTABI,
          signer
        );

        let tx = await IpfsNFT.staticMint(MetaHash, {
          gasLimit: 500000,
        });
        await tx.wait();

        toast.success("NFT minted successfully!");

        // Updating the user profile image here
        try {
          const res = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/imageupdate`,
            {
              image: `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`,
            },
            {
              headers: {
                cookies: document.cookie,
              },
            }
          );
          if (res.status == 200)
            toast.success("Profile image updated successfully!");
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Failed to update profile image!"
          );
        }
      } catch (error) {
        toast.error(`Error sending image to ipfs.`);
      }

      form.reset();
    } else {
      toast.error("Please select an image to upload");
    }
  };

  const importIpfsNFT = async ({ variables }) => {
    const { input } = variables;
    const { ipfsUrl } = input;
    let imageUrl;

    if (ipfsUrl && ipfsUrl.length > 0 && ipfsUrl.includes("ipfs")) {
      if (ipfsUrl.includes("ipfs://")) {
        imageUrl = "https://ipfs.io/ipfs/" + ipfsUrl.split("ipfs://")[1];
      } else {
        imageUrl = ipfsUrl;
      }
      try {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/imageupdate`,
          {
            image: imageUrl,
          },
          {
            headers: {
              cookies: document.cookie,
            },
          }
        );
        toast.success("Profile image updated successfully!");
      } catch (e) {
        toast.error("Could not update profile image!");
      }
    } else {
      toast.error("Please enter a valid ipfs url starting with ipfs://");
    }
  };

  return (
    <Card rounded="lg" className="lg:max-w-3xl">
      <Card.Body>
        <Heading size="h3">Options</Heading>
        <p className="text-muted text-sm">
          Adjust these setting according to your needs. Such as Dark Mode.
        </p>

        <div className="container pt-5 space-y-6 mx-auto">
          {/* <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <label className="text-sm font-medium dark:text-white text-gray-900">
                Dark Mode
              </label>
              <span className="text-sm text-muted">
                Change to light or dark mode.
              </span>
            </span>
            <ThemeToggle />
          </div> */}
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <label className="text-sm font-medium dark:text-white text-gray-900">
                Contact Us To Claim Free Tokens
              </label>
              <span className="text-sm text-muted">Claim free tokens</span>
            </span>
            <Button
              size="sm"
              variant="solid"
              onClick={() => {
                router.push("/airdrop");
              }}
            >
              Claim Token
            </Button>
          </div>
          {/* <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <label className="text-sm font-medium dark:text-white text-gray-900">
                Import Bitcoin Wallet Stamps
              </label>
            </span>
            <Button
              size="sm"
              variant="solid"
              onClick={async () => {
                setLoading(true);
                // get the user's bitcoin address
                const bitcoinWallet = getWalletCookie(document)?.hiroWallet;
                if (!bitcoinWallet) {
                  toast.error("Please connect your hiro wallet first");
                  return;
                }
                // get token from cookie
                const token = getCookie(document);
                if (!token) {
                  toast.error("Please login first");
                  return;
                }
                // get stamps from api
                try {
                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/token/stamp/import`,
                    {
                      bicoinWalletAddress: bitcoinWallet,
                    },
                    {
                      headers: {
                        cookies: token,
                      },
                    }
                  );

                  console.log("response: ", res);

                  toast.success("Stamps imported successfully");
                  setLoading(false);
                } catch (e) {
                  toast.error("Failed to import stamps");
                  console.log(e);
                  setLoading(false);
                  return;
                }
              }}
            >
              {loading ? "Loading..." : "Import Stamps"}
            </Button>
          </div> */}
          {/* <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <label className="text-sm font-medium dark:text-white text-gray-900">
                Import Bitcoin Wallet Ordinals
              </label>
            </span>
            <Button
              size="sm"
              variant="solid"
              onClick={async () => {
                setLoading(true);
                // get the user's bitcoin address
                const bitcoinWallet = getWalletCookie(document)?.hiroWallet;
                if (!bitcoinWallet) {
                  toast.error("Please connect your hiro wallet first");
                  return;
                }
                // get token from cookie
                const token = getCookie(document);
                if (!token) {
                  toast.error("Please login first");
                  return;
                }
                // get stamps from api
                try {
                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/token/ordinal/import`,
                    {
                      bicoinWalletAddress: bitcoinWallet,
                    },
                    {
                      headers: {
                        cookies: token,
                      },
                    }
                  );

                  console.log("response: ", res);

                  toast.success("Ordinals imported successfully");
                  setLoading(false);
                } catch (e) {
                  toast.error("Failed to import ordinals");
                  console.log(e);
                  setLoading(false);
                  return;
                }
              }}
            >
              {loading ? "Loading..." : "Import Ordinals"}
            </Button>
          </div> */}
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <label className="text-sm font-medium dark:text-white text-gray-900">
                {haveNFT ? "Have NFT?" : "Don't have NFT?"}
              </label>
              <span className="text-sm text-muted">
                {haveNFT
                  ? "Set your NFT as profile image here"
                  : "Upload a picture to mint a NFT and set it as your profile image"}
              </span>
            </span>
            <Switch.Group
              as="div"
              className="flex items-center justify-between"
            >
              <Switch
                checked={haveNFT}
                onChange={() => {
                  setHaveNFT(!haveNFT);
                }}
                className={clsx(
                  haveNFT ? "bg-brand-500" : "bg-gray-200",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    haveNFT ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </Switch.Group>
          </div>

          {haveNFT ? (
            <Form
              form={form}
              onSubmit={async (values) => {
                const changedValues = Object.fromEntries(
                  Object.keys(form.formState.dirtyFields).map((key) => [
                    key,
                    values[key],
                  ])
                );

                const input = {
                  ...changedValues,
                  ipfsUrl: values.ipfsUrl,
                };

                await importIpfsNFT({
                  variables: { input },
                });
              }}
            >
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Input
                    {...form.register("ipfsUrl")}
                    label="Ipfs Image Url"
                    placeholder="ipfs://Qm..."
                  />
                </div>
              </div>
              <Form.SubmitButton
                disabled={NFTMintDisabled}
                size="sm"
                variant="solid"
              >
                Import NFT
              </Form.SubmitButton>
            </Form>
          ) : (
            <Form
              form={form}
              onSubmit={async (values) => {
                const changedValues = Object.fromEntries(
                  Object.keys(form.formState.dirtyFields).map((key) => [
                    key,
                    values[key],
                  ])
                );

                const input = {
                  ...changedValues,
                  image: values?.image?.[0],
                };

                await sendFileToIPFS({
                  variables: { input },
                });
              }}
            >
              <FileInput
                name="image"
                label="Image"
                accept="image/png, image/jpg, image/jpeg"
                multiple={false}
              />
              <Form.SubmitButton size="sm" variant="solid">
                Mint
              </Form.SubmitButton>
            </Form>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
