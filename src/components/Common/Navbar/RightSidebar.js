import React from "react";
import { gql, useQuery } from "@apollo/client";
import { HiOutlineCubeTransparent } from "react-icons/hi";
import { FollowButton } from "~/components/Profile/FollowButton";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { ErrorFallback } from "~/components/ui/Fallbacks/ErrorFallback";
import { LoadingFallback } from "~/components/ui/Fallbacks/LoadingFallback";
import { GradientBar } from "~/components/ui/GradientBar";
import { Heading } from "~/components/ui/Heading";
import { Link } from "~/components/ui/Link";
import { Footer } from "../Footer";

export function RightSidebar() {
  return (
    <aside className="w-full sticky top-20 overflow-hidden">
      <div className=" space-y-4">
        <section aria-labelledby="who-to-follow-heading">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
            <GradientBar color="indigo" />
            <div className="p-6">
              <Heading size="h5">Who to follow</Heading>
              <div className="mt-6 flow-root">
                <ul
                  role="list"
                  className="-my-4 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {/* {data.whoToFollow.edges.map((edge) => {
										const user = edge?.node
										return (
											<li
												key={user?.id}
												className="flex items-center py-4 space-x-3"
											>
												<div className="flex-shrink-0">
													<img
														className="h-8 w-8 rounded-full object-cover"
														src={user?.avatar!}
														alt=""
													/>
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
														<Link
															className="no-underline"
															href={`/profile/${user?.username}`}
														>
															{user?.firstName + ' '}
															{user?.lastName ? user?.lastName : null}
														</Link>
													</p>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														<a href={user?.username}>@{user?.username}</a>
													</p>
												</div>
												<div className="flex-shrink-0">
													<FollowButton
														variant="dark"
														isFollowing={user?.isFollowing!}
														username={user?.username!}
													/>
												</div>
											</li>
										)
									})} */}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </aside>
  );
}
