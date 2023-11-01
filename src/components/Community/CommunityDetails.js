import React from "react";
import { format } from "date-fns";
import clsx from "clsx";
import { Card } from "../ui/Card";
import { HiOutlineCheckCircle } from "react-icons/hi";
export function CommunityDetails({
  communityRules,
  createdAt,
  memberCount,
  isNSFWAllowed,
}) {
  return (
    <Card
      noPadding
      className="py-2 px-4 w-96 flex justify-between bg-gray-25 dark:bg-black overflow-hidden my-3 rounded-lg"
    >
      <article className="flex flex-col">
        <div className="px-4 pt-6 sm:px-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Community Rules:
          </h1>
        </div>
        <ul className="px-4 py-5 sm:p-6">
          {communityRules?.map((rule, ind) => {
            return (
              <li key={ind} className="flex flex-row">
                <HiOutlineCheckCircle />
                &nbsp;
                <p className="text-gray-900 dark:text-white">{rule}</p>
              </li>
            );
          })}
        </ul>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-gray-900 dark:text-white">
            NSFW Allowed: {isNSFWAllowed ? "Yes" : "No"}
          </p>
          <p className="text-gray-900 dark:text-white">
            Member Count: {memberCount}
          </p>
        </div>
        <span className="text-xs dark:text-gray-300 text-gray-600 px-4 py-5 sm:p-6">
          {" "}
          Created At {format(new Date(createdAt), "MMMM, yyyy")}
        </span>
      </article>
    </Card>
  );
}
