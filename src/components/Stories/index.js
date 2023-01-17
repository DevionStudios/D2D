import React, { useEffect, useState } from "react";
import { Link } from "../ui/Link";

export const StoryBar = ({ currentUser }) => {
  const [following, setFollowing] = useState([]);
  console.log("Following: ", following);

  useEffect(() => {
    setFollowing(currentUser.following);
  }, [currentUser]);

  return following && following.length > 0 ? (
    <>
      <div className="bg-white/70 dark:bg-black backdrop-blur-md px-4 sm:px-4 md:px-6 lg:px-10 xl:px-12 z-10 pb-2 truncate">
        <div className="mx-auto max-w-7xl relative flex justify-start xl:grid xl:grid-cols-10">
          {following &&
            following.length > 0 &&
            following.map((user, index) => {
              return user.stories && user.stories.length > 0 ? (
                <div key={index}>
                  <Link
                    href={`/stories/${user.username}`}
                    className="no-underline"
                  >
                    <div className="flex-shrink-0 mx-1">
                      <img
                        className="h-14 w-14 rounded-full"
                        src={user.image}
                        alt=""
                      />
                    </div>
                  </Link>
                </div>
              ) : null;
            })}
        </div>
      </div>
    </>
  ) : null;
};
