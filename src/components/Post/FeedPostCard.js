import { useState } from "react";
import {
  HiHeart,
  HiOutlineBadgeCheck,
  HiOutlineCurrencyDollar,
  HiOutlineHeart,
  HiOutlineReply,
  HiOutlineShare,
  HiOutlineSupport,
} from "react-icons/hi";
import { format } from "date-fns";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

import { Card } from "~/components/ui/Card";
import { Interweave } from "../Interweave";
import { ReplyModal } from "./ReplyModal";
import { Button } from "../ui/Button";
import { Link } from "~/components/ui/Link";
import { PostDropdown } from "./PostDropdown";
import NextImage from "next/image";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";

// import D2DToken from "../constants/frontEndAbiLocation/D2DToken.json";
// import networkMapping from "../constants/networkMapping.json";

export let TOGGLE_LIKE_MUTATION;

export function FeedPostCard(props) {
  const [isOpen, setIsOpen] = useState(false);
  const { account } = useMoralis();

  let toggleLike, loading;

  function handleCacheUpdate(cache) {
    cache.modify({
      id: `Post:${props.post.id}`,
      fields: {
        isLiked: (prev) => !prev,
        likes: (prev) => {
          return {
            ...prev,
            totalCount: prev.totalCount + (props?.post.isLiked ? -1 : 1),
          };
        },
      },
    });
  }

  if (!props.post || !props.post.user) {
    return <ErrorFallback message="Failed to load" />;
  }

  // ! Test this after deploying the contract
  const tip = async (receiverWalletAddress) => {
    const { ethereum } = window;
    if (ethereum && receiverWalletAddress && account) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const D2DTokenContract = new ethers.Contract(
          // networkMapping[chainId]["D2DToken"].slice(-1)[0], //TODO uncommment this
          // D2DtokenAbi, //TODO uncommment this
          signer
        );
        let transfer = await D2DTokenContract.transferFrom(
          props.currentUser.ethAddress,
          receiverWalletAddress,
          // amount, //TODO uncommment this
          {
            gasLimit: 500000,
          }
        );
      } catch (err) {
        console.log(err);
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

  return (
    <Card noPadding className="max-w-2xl overflow-hidden my-3 rounded-lg ">
      <article>
        <div className="px-6 py-4">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={props.post.user.avatar}
                alt={`Profile avatar of ${props.post.user.username}`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/profile/${props.post.user.username}`}
                className="no-underline"
              >
                <p className="text-sm font-medium ">
                  {props.post?.user?.name}
                  {/* {props.post?.user?.lastName
                    ? props.post?.user?.lastName
                    : null} */}
                  <span className="text-muted text-sm ml-2">
                    @{props.post?.user?.username}
                  </span>
                </p>
              </Link>
              <p className="text-sm text-gray-500">
                <a href="#" className="hover:underline">
                  <time dateTime="2020-12-09T11:43:00">
                    {format(
                      new Date(props.post.createdAt),
                      "MMMM d, hh:mm aaa"
                    )}
                  </time>
                </a>
              </p>
            </div>
            <div className="flex-shrink-0 self-center flex">
              <PostDropdown
                id={props.post.id}
                isMine={props.post.isMine}
                caption={props.post.caption ?? ""}
                gifLink={props.post.gifImage ?? ""}
              />
            </div>
          </div>
        </div>

        {/* GIF */}

        <Link
          href={`/post/${props.post.id}`}
          className="mt-1 block no-underline font-normal outline-none focus:outline-none focus:ring-0"
        >
          {props.post.gifImage && (
            <div className="mx-auto w-11/12 rounded-lg overflow-hidden">
              <img className="w-full" src={props.post.gifImage} alt="" />
            </div>
          )}

          {props.post.image && (
            <div className="mx-auto w-11/12 rounded-lg overflow-hidden ">
              <div className="aspect-w-1 aspect-h-1">
                <NextImage
                  src={props.post.image}
                  layout="fill"
                  objectFit="cover"
                  placeholder="empty"
                  alt={`Image posted by ${props.post.user.name} on D2D.`}
                />
              </div>
            </div>
          )}

          {/* Caption */}

          <div className="px-6  pb-2 my-2">
            <p className=" space-y-4 dark:text-gray-300">
              <Interweave content={props.post.caption} />
            </p>
          </div>
        </Link>

        {/* Post Actions */}
        <div className="py-2 px-6 bg-gray-50 dark:bg-gray-900/30 flex border-t border-gray-200 dark:border-gray-700 justify-between space-x-8">
          <div className="flex space-x-6">
            <span className="inline-flex items-center space-x-2  ">
              <Button
                loading={loading}
                variant="dark"
                onClick={async () => {
                  await toggleLike({ variables: { id: props.post.id } });
                }}
                className="rounded-full overflow-hidden space-x-2"
              >
                {props.post.isLiked ? (
                  <HiHeart className="w-5 h-5 text-brand-700" />
                ) : (
                  <HiOutlineHeart className="w-5 h-5" />
                )}
                <p>{props.post.likes?.totalCount}</p>
              </Button>
            </span>
            <span className="inline-flex items-center space-x-2">
              <Button
                variant="dark"
                onClick={() => setIsOpen(true)}
                className="space-x-2"
              >
                <HiOutlineReply className="w-5 h-5" />
                <p>{props.post.comments?.totalCount}</p>
              </Button>
              <ReplyModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                {...props}
              />
            </span>
            {/* To Tip on the posts */}
            <span className="inline-flex items-center space-x-2">
              <Button
                variant="dark"
                className="space-x-2"
                onClick={() => tip(props?.post?.user?.walletAddress)}
              >
                <HiOutlineCurrencyDollar className="w-10 h-6" />
              </Button>
            </span>
          </div>
          <div>
            <span className="inline-flex items-center space-x-2  ">
              <Button
                variant="dark"
                onClick={async () => {
                  navigator.clipboard
                    .writeText(`https://d2d.vercel.app/post/${props.post.id}`)
                    .then(() => toast.success("Link copied to clipboard"));
                }}
              >
                <HiOutlineShare className="w-6 h-6 " />
              </Button>
            </span>
          </div>
        </div>
      </article>
    </Card>
  );
}
