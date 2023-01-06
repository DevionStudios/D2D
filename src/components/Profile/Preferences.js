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

export function Preferences({ currentUser }) {
  const { account, chainId } = useMoralis();
  const [isDisabled, setIsDisabled] = useState(false);
  const [NFTMintDisabled, setNFTMintDisabled] = useState(false);
  const [fileImg, setFileImg] = useState(null);

  const ImageFormSchema = object({
    image: z.any(),
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/reward/claim`,
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
      toast.error(
        "Something went wrong! Please check if your wallet is connected!"
      );
      console.log(e);
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
        console.log("Image Hash: ", ImgHash);
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
        console.log("Meta Hash: ", MetaHash);
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
          console.log(res.data);
          if (res.status == 200)
            toast.success("Profile image updated successfully!");
        } catch (e) {
          console.log(e);
        }
      } catch (error) {
        console.log(error);

        toast.error(`Error: ${error.message}`);
      }

      form.reset();
    } else {
      toast.error("Please select an image to upload");
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
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <label className="text-sm font-medium dark:text-white text-gray-900">
                Mint an NFT
              </label>
              <span className="text-sm text-muted">
                Upload an image to mint an NFT and update your profile picture
              </span>
            </span>
          </div>
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
                coverImage: values?.coverImage?.[0],
                bio: values.bio,
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
            <Form.SubmitButton
              disabled={NFTMintDisabled}
              size="sm"
              variant="solid"
              onClick={() => {
                setIsDisabled(true);
              }}
            >
              Mint
            </Form.SubmitButton>
          </Form>
        </div>
      </Card.Body>
    </Card>
  );
}
