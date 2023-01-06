import { format } from "date-fns";
import { HiBadgeCheck, HiOutlineCalendar } from "react-icons/hi";
import useMediaQuery, { MEDIA_QUERIES } from "src/utils/useMediaQuery";
import { Button } from "../ui/Button";
import ButtonOrLink from "../ui/ButtonOrLink";
import { FollowButton } from "./FollowButton";
import { UserPosts } from "./UserPosts";
import { useEffect, useState } from "react";
import axios from "axios";

export function Profile({ user, isMe, username, currentUser }) {
  const isMobile = useMediaQuery(MEDIA_QUERIES.SMALL);
  const [userPosts, setUserPosts] = useState(undefined);
  const fetchUserPost = async function () {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${user.username}`
      );
      setUserPosts(data);
      // !remove console.log(data);
    } catch (error) {
      // !remove console.log(error);
    }
  };
  useEffect(() => {
    fetchUserPost();
  }, []);
  return user ? (
    <div className="py-16">
      <div className="pt-5">
        {user.coverImage ? (
          <img
            className="h-60 w-full object-cover lg:h-80"
            src={user.coverImage}
            alt="User Cover Image"
          />
        ) : null}
      </div>
      <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 ">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <img
              className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-500 sm:h-32 sm:w-32"
              src={
                user.image ??
                "https://res.cloudinary.com/dogecorp/image/upload/v1631712846/d2d/v1/images/8_ni0eag.svg"
              }
              alt=""
            />
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
                {isMe ? (
                  <Button
                    href={`/account/settings`}
                    size={isMobile ? "base" : "lg"}
                  >
                    Edit Profile
                  </Button>
                ) : !currentUser.annonymous ? (
                  <FollowButton
                    isFollowing={
                      user.followers.length > 0
                        ? user.followers.map((follower, index) => {
                            if (follower.id === currentUser.id) {
                              return true;
                            }
                            if (index === user.followers.length - 1)
                              return false;
                          })
                        : false
                    }
                    username={user.username}
                    id={user.id}
                    size={isMobile ? "base" : "lg"}
                  />
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
                <span className="font-bold mr-2">{user.followers.length}</span>
                <ButtonOrLink
                  href={`/profile/${user.username}/follows?name=${user.name}&type=followers`}
                  className="text-muted hover:underline"
                >
                  Followers
                </ButtonOrLink>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">{user.following.length}</span>
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
        />
      </div>
    </div>
  ) : (
    <>Loading!</>
  );
}
