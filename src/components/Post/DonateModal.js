import { format } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";

// import { Interweave } from "../Interweave";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { z } from "zod";
import Form, { useZodForm } from "../ui/Form/Form";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";
import { TextArea } from "../ui/TextArea";
import { Input } from "../ui/Input";
import Link from "next/link";
import { ethers } from "ethers";
import FoxxiToken from "../../constants/ABIs/FoxxiToken.json";
import networkMapping from "../../constants/networkMapping.json";
import { useMoralis } from "react-moralis";

export let CREATE_COMMENT_MUTATION;

export function DonateModal({
  isOpen,
  onClose,
  receiverWalletAddress,
  ...props
}) {
  const { account, chainId } = useMoralis();
  const tip = async (values) => {
    const networkChainId = chainId?.toString().split("0x")[1] || "5";
    const amountToSend = values.amount; // since 18 decimals for token is reserved
    const { ethereum } = window;
    if (
      ethereum &&
      receiverWalletAddress &&
      account &&
      receiverWalletAddress.length > 0
    ) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          networkMapping[networkChainId]["FoxxiToken"].slice(-1)[0],
          FoxxiToken,
          signer
        );
        let transfer = await tokenContract.transfer(
          receiverWalletAddress,
          ethers.utils.parseEther(amountToSend.toString()),
          {
            gasLimit: 500000,
          }
        );
      } catch (err) {
        toast.error("Wallet Address of receiver not found!");
      }
    } else {
      if (!account) {
        toast.error("Please connect your wallet!");
      } else if (!receiverWalletAddress) {
        toast.error("Wallet Address of receiver not found!");
      } else {
        toast.error("Please install an Ethereum Wallet!");
      }
    }
  };
  const CommentSchema = z.object({
    amount: z.string().min(1),
  });

  const form = useZodForm({
    schema: CommentSchema,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg">
      <Modal.Header dismiss>
        <Heading size="h4" className="-mt-2 mb-3">
          Donate
        </Heading>
      </Modal.Header>
      <div className="max-w-3xl mx-auto">
        <div className="px-3">
          <Link href={`/profile/${props.post?.author?.username}`} passHref>
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={props.post.author?.image}
                  alt=""
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium ">
                  <a href="#" className="hover:underline">
                    {props.post?.author?.name + " " ?? ""}
                    <span className="text-muted text-sm ml-2">
                      @{props.post?.author?.username}
                    </span>
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  <a href="#" className="hover:underline">
                    <time>
                      {format(
                        new Date(props.post.createdAt),
                        "MMMM d, hh:mm aaa"
                      )}
                    </time>
                  </a>
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className=" mt-4">
          <p className=" space-y-4 dark:text-gray-300">
            {/* {props.post.caption && !props.post.image && (
              <Interweave content={props.post.caption} />
            )}
            {props.post.caption && props.post.image && (
              <Interweave content={props.post.caption + props.post.image} />
            )} */}
          </p>
        </div>
        <div className="w-full mt-4">
          <Card.Body noPadding>
            <Form
              form={form}
              onSubmit={async (values) => {
                await tip(values);
                onClose();
              }}
            >
              <Input
                label="Your reply"
                type="number"
                placeholder="Enter Token Amount"
                {...form.register("amount")}
              />

              <div className="flex justify-end space-x-2">
                <Form.SubmitButton>Donate</Form.SubmitButton>
                <Button type="button" onClick={onClose} variant="dark">
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </div>
      </div>
    </Modal>
  );
}
