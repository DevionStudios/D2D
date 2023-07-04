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
import { FollowButton } from "./FollowButton";
import { UserPosts } from "./UserPosts";
import { useEffect, useState } from "react";
import { Menu, MenuItem } from "../ui/Dropdown";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { WalletTypes } from "src/constants/constants";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
export function Profile({ user, isMe, username, currentUser }) {
  const isMobile = useMediaQuery(MEDIA_QUERIES.SMALL);
  const [userPosts, setUserPosts] = useState(undefined);
  const [hasStories, sethasStories] = useState(false);
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  console.log(auth);
  const fetchUserPost = async function () {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${user.username}`
      );
      setUserPosts(data);
    } catch (error) {
      //  console.log(error);
    }
  };
  const fetchhasStories = async function () {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/story/${user.username}`
      );

      if (data.length > 0) {
        sethasStories(true);
      }
    } catch (error) {
      //  console.log(error);
    }
  };

  const reportUser = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/report`,
        {
          userId: user.id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );

      if (response.status === 200) {
        toast.success("User reported");
      } else {
        toast.error("You have already reported this user");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to report user");
    }
  };
  console.log(user);

  useEffect(() => {
    fetchUserPost();
    fetchhasStories();
  }, []);
  return user ? (
    !user.isBanned ? (
      <div className="py-16">
        <div className="pt-5">
          {user.coverImage ? (
            <img
              className="h-60 w-full object-cover lg:h-80"
              src={user.coverImage}
              alt="User Cover Image"
            />
          ) : (
            <div className="py-16 h-20 w-full lg:h-20 ">
              <div className="pt-5"> </div>
            </div>
          )}
        </div>
        <div className={"max-w-5xl mx-auto px-2 sm:px-6 lg:px-8"}>
          <div className="mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <Link passHref href={`/stories/${user.username}`}>
                <img
                  className={
                    hasStories
                      ? "h-24 w-24 rounded-full object-cover ring-4 ring-red-500 sm:h-32 sm:w-32"
                      : "h-24 w-24 rounded-full object-cover ring-4 ring-brand-500 sm:h-32 sm:w-32"
                  }
                  src={user.image}
                  alt=""
                />
              </Link>
            </div>
          </div>
          <div className=" sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="space-y-4 2xl:block mt-6 min-w-0 flex-1 px-2 md:px-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold flex truncate items-center">
                    {user.name}
                    <HiBadgeCheck className="w-6 h-6 ml-1 text-brand-700" />
                  </h1>
                  <p className="text-muted text-sm">@{user.username}</p>
                </div>
                <div className=" flex items-center justify-stretch  sm:flex-row sm:space-y-0 sm:space-x-5">
                  <div className="mr-3">
                    {currentUser.username !== username &&
                    currentUser.annonymous !== true ? (
                      <Menu
                        dropdown={
                          <MenuItem
                            onClick={() => reportUser()}
                            icon={<HiOutlineFlag />}
                          >
                            Report Profile
                          </MenuItem>
                        }
                      >
                        <span className="-m-2 p-2 rounded-full flex items-center dark:hover:bg-gray-700 hover:bg-gray-300">
                          <HiOutlineDotsVertical className="w-5 h-5" />
                        </span>
                      </Menu>
                    ) : null}
                  </div>
                  {isMe ? (
                    <div className="flex flex-row-reverse gap-2">
                      <div>
                        <Button
                          href={`/account/settings`}
                          size={isMobile ? "base" : "lg"}
                        >
                          Edit Profile
                        </Button>
                      </div>
                      <div>
                        <Button
                          // href={`/account/gallery`}
                          onClick={(e) => {
                            e.preventDefault();
                            let cookies = document.cookie;
                            // check if foxxi_user_wallet cookie exists
                            let cookie = cookies
                              .split("foxxi_user_wallet=")?.[1]
                              ?.split(";")?.[0];
                            console.log(cookie);
                            if (cookie) {
                              cookie = JSON.parse(cookie);
                              if (cookie?.hiroWallet) {
                                router.push(
                                  `/account/gallery/${currentUser.username}`
                                );
                              }
                            } else {
                              toast.error(
                                "You need to connect your hiro wallet first"
                              );
                            }
                          }}
                          size={isMobile ? "base" : "lg"}
                        >
                          Web3 Gallery
                        </Button>
                      </div>
                    </div>
                  ) : !currentUser.annonymous ? (
                    <>
                      <div>
                        <Button
                          // href={`/account/gallery/${user.accountWallet}`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (user?.username) {
                              router.push(`/account/gallery/${user.username}`);
                            } else {
                              toast.error(
                                "User has not connected their hiro wallet yet"
                              );
                            }
                          }}
                          size={isMobile ? "base" : "lg"}
                        >
                          Web3 Gallery
                        </Button>
                      </div>
                      <FollowButton
                        isFollowing={user?.followers
                          ?.map((f) => f.id)
                          .includes(currentUser.id)}
                        username={user.username}
                        id={user.id}
                        size={isMobile ? "base" : "lg"}
                        className="mx-1"
                        currentUser={currentUser}
                      />
                      <Button
                        href={`/chat/${user.id}`}
                        size={isMobile ? "base" : "lg"}
                        className="mx-1"
                      >
                        Message
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>

              {user.bio && <p>{user.bio}</p>}

              <div>
                <dl className="mt-6 flex flex-col sm:mt-1 sm:flex-row sm:flex-wrap">
                  <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                    <HiOutlineCalendar
                      className="flex-shrink-0 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Joined {format(new Date(user.createdAt), "MMMM, yyyy")}
                  </dd>
                </dl>
              </div>
              <div className="flex space-x-4">
                <div className="flex">
                  <span className="font-bold mr-2">
                    {user.followers.length}
                  </span>
                  <ButtonOrLink
                    href={`/profile/${user.username}/follows?name=${user.name}&type=followers`}
                    className="text-muted hover:underline"
                  >
                    Followers
                  </ButtonOrLink>
                </div>
                <div className="flex">
                  <span className="font-bold mr-2">
                    {user.following.length}
                  </span>
                  <ButtonOrLink
                    href={`/profile/${user.username}/follows?name=${user.name}&type=following`}
                    className="text-muted hover:underline"
                  >
                    Following
                  </ButtonOrLink>
                </div>
              </div>
            </div>
          </div>
          <UserPosts
            count={userPosts ? userPosts.length : 0}
            posts={userPosts || []}
            username={user.username}
            currentUser={currentUser}
            user={user}
            storiesCount={hasStories ? hasStories.length : 0}
            stories={hasStories || []}
          />
        </div>
      </div>
    ) : (
      <h1 className="mt-12 pt-12 text-center">
        The User Has Been Banned Due To Undesirable Activities
      </h1>
    )
  ) : (
    <h1>Loading...</h1>
  );
}
