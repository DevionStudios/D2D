import { format } from "date-fns";
import {
  HiBadgeCheck,
  HiOutlineFlag,
  HiOutlineCalendar,
  HiOutlineDotsVertical,
} from "react-icons/hi";
import useMediaQuery, { MEDIA_QUERIES } from "src/utils/useMediaQuery";
import { Button } from "../ui/Button";
import ButtonOrLink from "../ui/ButtonOrLink";
import { useEffect, useState } from "react";
import { Menu, MenuItem } from "../ui/Dropdown";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { WalletTypes } from "src/constants/constants";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { CommunityPosts } from "./CommunityPosts";
import { JoinButton } from "./JoinButton";
import { EditCommunityModal } from "./EditCommunityModal";
export function Community({ communityName, currentUser }) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const isMobile = useMediaQuery(MEDIA_QUERIES.SMALL);
  const [community, setCommunity] = useState({
    name: "testcom",
    publicName: "TestCom",
    members: [currentUser.username],
    banner: "/assets/banner.jpg",
    description: "This is the frontend of test community",
    createdAt: "2021-08-22T11:35:30.000Z",
    isNSFW: false,
    rules: ["No Spamming", "No Nudity", "No Racism", "No Hate Speech"],
  });
  const [isMyCommunity, setIsMyCommunity] = useState(true); // by default it is kept false
  return community ? (
    <>
      <div className="py-16">
        <div className="pt-5">
          {community.banner ? (
            <img
              className="h-60 w-full object-contain lg:h-80"
              src={community.banner}
              alt="Community Banner Image"
              style={{
                backgroundSize: "100vw 100vh",
              }}
            />
          ) : (
            <img
              className="h-60 w-full object-contain lg:h-80"
              src="/assets/banner.jpg"
              alt="Community Banner Image"
              style={{
                backgroundSize: "100vw 100vh",
              }}
            />
          )}
        </div>
        <div className={"max-w-5xl mx-auto px-2 sm:px-6 lg:px-8"}>
          <div className=" sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="space-y-4 2xl:block mt-6 min-w-0 flex-1 px-2 md:px-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold flex truncate items-center">
                    {community?.publicName}
                    <HiBadgeCheck className="w-6 h-6 ml-1 text-brand-700" />
                  </h1>
                  <p className="text-muted text-sm">@{community?.name}</p>
                </div>
                <div className=" flex items-center justify-stretch  sm:flex-row sm:space-y-0 sm:space-x-5">
                  <div className="mr-3">
                    {currentUser.annonymous !== true ? (
                      <Menu
                        dropdown={
                          <MenuItem onClick={() => {}} icon={<HiOutlineFlag />}>
                            Report Community
                          </MenuItem>
                        }
                      >
                        <span className="-m-2 p-2 rounded-full flex items-center dark:hover:bg-gray-700 hover:bg-gray-300">
                          <HiOutlineDotsVertical className="w-5 h-5" />
                        </span>
                      </Menu>
                    ) : null}
                  </div>
                  {isMyCommunity ? (
                    <div className="flex flex-row-reverse gap-2">
                      <div>
                        <Button
                          onClick={() => {
                            setIsUpdateModalOpen(true);
                          }}
                          size={isMobile ? "base" : "lg"}
                        >
                          Edit Community
                        </Button>
                      </div>
                      <div>
                        <JoinButton
                          currentUser={currentUser}
                          isJoined={true}
                          size={isMobile ? "base" : "lg"}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <JoinButton
                        currentUser={currentUser}
                        isJoined={true}
                        size={isMobile ? "base" : "lg"}
                      />
                    </div>
                  )}
                </div>
              </div>

              {community.description && <p>{community.description}</p>}

              <div>
                <dl className="mt-6 flex flex-col sm:mt-1 sm:flex-row sm:flex-wrap">
                  <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                    <HiOutlineCalendar
                      className="flex-shrink-0 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Created On{" "}
                    {format(new Date(community.createdAt), "MMMM, yyyy")}
                  </dd>
                </dl>
              </div>
              <div className="flex space-x-4">
                <div className="flex">
                  <span className="font-bold mr-2">
                    {community.members.length}
                  </span>
                  <ButtonOrLink href="#" className="text-muted hover:underline">
                    Members
                  </ButtonOrLink>
                </div>
              </div>
            </div>
          </div>
          <CommunityPosts
            currentUser={currentUser}
            communityname={communityName}
            createdAt={community.createdAt}
            isNSFWAllowed={true}
            communityRules={community.rules}
            memberCount={community.members.length}
          />
        </div>
      </div>

      {/* prefill most values */}
      <EditCommunityModal
        currentUser={currentUser}
        isOpen={isUpdateModalOpen}
        setIsOpen={setIsUpdateModalOpen}
      />
    </>
  ) : (
    <h1>Loading...</h1>
  );
}
