import { HiOutlineCubeTransparent } from "react-icons/hi";
import { FollowButton } from "src/components/Profile/FollowButton";
import { Card } from "src/components/ui/Card";
import { ErrorFallback } from "src/components/ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "src/components/ui/Fallbacks/LoadingFallback";
import { GradientBar } from "src/components/ui/GradientBar";
import { Heading } from "src/components/ui/Heading";
import { Link } from "src/components/ui/Link";
// import { Footer } from "../Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { JoinButton } from "./JoinButton";
import { Button } from "../ui/Button";
import { useRouter } from "next/router";

export function DiscoverCommunity({ currentUser, setIsCreateModalOpen }) {
  const router = useRouter();
  const [suggestedCommunitites, setsuggestedCommunitites] = useState([
    {},
    {},
    {},
    {},
  ]);
  const [joinedCommunities, setJoinedCommunities] = useState([{}]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  //   if (suggestedCommunitites.length === 0) {
  //     return (
  //       <>
  //         <Card rounded="lg" className="sticky top-20 dark:bg-black bg-gray-75">
  //           {!currentUser.annonymous ? (
  //             <ErrorFallback
  //               message="No community suggestions for now. :)"
  //               noAction
  //               icon={
  //                 <HiOutlineCubeTransparent className="h-12 w-12 text-gray-500" />
  //               }
  //             />
  //           ) : (
  //             <ErrorFallback
  //               message="Please Sign Up To See Suggestions."
  //               icon={
  //                 <HiOutlineCubeTransparent className="h-12 w-12 text-gray-500" />
  //               }
  //               noAction
  //             />
  //           )}
  //         </Card>
  //       </>
  //     );
  //   }

  return (
    <aside className="w-full sticky top-20">
      <div className=" space-y-4">
        <section aria-labelledby="who-to-follow-heading">
          <div className="dark:bg-gray-800 bg-gray-50 rounded-lg mt-10 overflow-hidden shadow">
            <GradientBar color="indigo" />
            <div className="p-6">
              <h5 className="font-bold dark:text-white text-xl">
                Discover Communities{" "}
              </h5>
              <span
                className="text-xs dark:text-gray-300 text-gray-600 hover:underline"
                onClick={() => {
                  // redirect to discover communities page
                  router.push("/community/discover");
                }}
              >
                {" "}
                See All
              </span>
              <div className="mt-6 flow-root h-36 overflow-y-auto no-scrollbar">
                <ul
                  role="list"
                  className="-my-4 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {suggestedCommunitites.map((data) => {
                    const community = data;
                    return (
                      <li key={1} className="flex items-center py-4 space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src="/assets/community.jpg"
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            <Link className="no-underline" href="#">
                              Community Name
                              {/* {community?.lastName ? community?.lastName : null} */}
                            </Link>
                          </p>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            500+ joined
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          <JoinButton
                            currentUser={currentUser}
                            isJoined={false}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className=" space-y-4">
        <section aria-labelledby="who-to-follow-heading">
          <div className="dark:bg-gray-800 bg-gray-50 rounded-lg mt-10 overflow-hidden shadow">
            <GradientBar color="indigo" />
            <div className="p-6">
              <h5 className="font-bold dark:text-white text-xl">
                Joined Communities
              </h5>
              <span
                className="text-xs dark:text-gray-300 text-gray-600 hover:underline"
                onClick={() => {
                  // redirect to joined communities page
                  router.push("/community/joined");
                }}
              >
                {" "}
                See All
              </span>
              <ul
                role="list"
                className="-my-4 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <div className="mt-6 flow-root h-28 overflow-y-auto no-scrollbar">
                  <ul
                    role="list"
                    className="-my-4 divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    {joinedCommunities.map((data) => {
                      const community = data;
                      return (
                        <li
                          key={1}
                          className="flex items-center py-4 space-x-3"
                        >
                          <div className="flex-shrink-0">
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src="/assets/community.jpg"
                              alt=""
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              <Link className="no-underline" href="#">
                                Community Name
                                {/* {community?.lastName ? community?.lastName : null} */}
                              </Link>
                            </p>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              500+ joined
                            </span>
                          </div>
                          <div className="flex-shrink-0">
                            <JoinButton
                              currentUser={currentUser}
                              isJoined={true}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex-shrink-0 mx-auto text-center py-4 space-x-3">
                  <Button
                    onClick={() => {
                      // TODO: open create community modal
                      setIsCreateModalOpen(true);
                    }}
                  >
                    Create Community
                  </Button>
                </div>
              </ul>
            </div>
          </div>
        </section>
      </div>
      {/* <ConnectButton /> */}
      {/* <Footer /> */}
    </aside>
  );
}
