import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { Heading } from "../ui/Heading";
import { useEffect, useState } from "react";
import { JoinButton } from "./JoinButton";
import Link from "next/link";
import Modal from "../ui/Modal";
import { Menu, MenuItem } from "../ui/Dropdown";
import toast from "react-hot-toast";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";

import {
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineDotsVertical,
} from "react-icons/hi";
export function AllCommunityUsersModal({
  currentUser,
  communityName,
  setIsOpen,
  isOpen,
  isAdmin,
}) {
  const [hasMoreData, setHasMoreData] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 5;
  const [data, setData] = useState([]);
  const router = useRouter();
  if (!data)
    return (
      <ErrorFallback
        action={() => router.reload()}
        message={`Failed to load search result.`}
        buttonText="Try again."
      />
    );

  const users = data;

  const fetchMembersData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/users/${communityName}?skip=${skip}&limit=${limit}`
      );
      console.log(response.data);
      if (response.data?.communityMembers?.length > 0)
        setData([...data, ...response.data?.communityMembers]);
      else setHasMoreData(false);
      setSkip(skip + limit);
    } catch (e) {
      toast.error("Failed to fetch posts.");
    }
  };
  const moderateUser = async (userId, newRole) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/member/role/edit`,
        {
          userId: userId,
          name: communityName,
          newRole: newRole,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      if (response.status === 200) {
        toast.success("User Role Updated Successfully");
        window.location.reload();
      } else {
        toast.error("Failed To Update User Role");
      }
    } catch (e) {
      toast.error("Failed To Update User Role");
    }
  };

  useEffect(() => {
    fetchMembersData();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="sm:max-w-lg"
    >
      <Modal.Header>
        <Heading size="h4">Community Members</Heading>
      </Modal.Header>
      <div className="dark:bg-gray-900 " style={{ marginTop: "100px" }}>
        <div className="flow-root mt-2 px-4 dark:bg-gray-900">
          <ul role="list" className=" divide-y divide-gray-200">
            {users.length > 0 ? (
              <InfiniteScroll
                next={fetchMembersData}
                dataLength={data?.length}
                loader={<LoadingFallback />}
                hasMore={hasMoreData}
                endMessage={() => {
                  return <div>You Have Reached The End!</div>;
                }}
              >
                {users.map((edge) => {
                  const user = edge;
                  if (user) {
                    return (
                      <li key={user.id} className="py-4 mx-6">
                        <div className="flex items-center justify-evenly space-x-4">
                          <Link
                            href={`/profile/${user?.userId?.username}`}
                            passHref={true}
                          >
                            <div>
                              <div className="flex-shrink-0">
                                <img
                                  className="h-20 w-20 rounded-full"
                                  src={
                                    user?.userId?.image?.length > 0
                                      ? user?.userId?.image
                                      : "/assets/user.png"
                                  }
                                  alt="user Image"
                                />
                              </div>
                              <div className="pt-2 flex-1 min-w-0 text-center">
                                <p className="text-md font-medium truncate">
                                  {user?.userId?.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {"@" + user?.userId?.username}
                                </p>
                              </div>
                            </div>
                          </Link>
                          <div>
                            <Button
                              onClick={() => {
                                // go to profile
                                router.push(
                                  `/profile/${user?.userId?.username}`
                                );
                              }}
                            >
                              View Profile
                            </Button>
                          </div>
                          {isAdmin && (
                            <Menu
                              dropdown={
                                <>
                                  {user?.role !== "admin" ? (
                                    <MenuItem
                                      onClick={() => {
                                        moderateUser(user?.userId?.id, "admin");
                                      }}
                                      icon={<HiOutlineArrowUp />}
                                    >
                                      Promote To Admin
                                    </MenuItem>
                                  ) : (
                                    <MenuItem
                                      onClick={() => {
                                        moderateUser(
                                          user?.userId?.id,
                                          "member"
                                        );
                                      }}
                                      icon={<HiOutlineArrowDown />}
                                    >
                                      Demote To Member
                                    </MenuItem>
                                  )}
                                  {user?.role !== "banned" ? (
                                    <MenuItem
                                      onClick={() => {
                                        moderateUser(
                                          user?.userId?.id,
                                          "banned"
                                        );
                                      }}
                                      icon={<HiOutlineLockClosed />}
                                    >
                                      Ban User
                                    </MenuItem>
                                  ) : (
                                    <MenuItem
                                      onClick={() => {
                                        moderateUser(
                                          user?.userId?.id,
                                          "member"
                                        );
                                      }}
                                      icon={<HiOutlineLockOpen />}
                                    >
                                      Unban User
                                    </MenuItem>
                                  )}
                                </>
                              }
                            >
                              <span className="-m-2 p-2 rounded-full flex items-center dark:hover:bg-gray-700 hover:bg-gray-300">
                                <HiOutlineDotsVertical className="w-5 h-5" />
                              </span>
                            </Menu>
                          )}
                        </div>
                      </li>
                    );
                  }
                })}
              </InfiniteScroll>
            ) : (
              <ErrorFallback
                action={() => router.back()}
                message={`No Members To Show!`}
                buttonText="Go back"
              />
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
