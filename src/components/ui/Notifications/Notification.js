import {
  HiHeart,
  HiOutlineInformationCircle,
  HiOutlineReply,
  HiOutlineUserAdd,
} from "react-icons/hi";
import Link from "next/link";
import { formatDistance } from "date-fns";
import * as React from "react";

const NOTIFICATION_ICON = {
  USER_FOLLOW: <HiOutlineUserAdd className="text-gray-500" />,
  POST_LIKE: <HiHeart className="text-red-600" />,
  POST_REPLY: <HiOutlineReply className="text-gray-500" />,
  MESSAGE: <HiOutlineReply className="text-gray-500" />,
  ADMIN: <HiOutlineInformationCircle className="text-yellow-600" />,
  MENTION: <HiOutlineInformationCircle className="text-green-600" />,
};

export function Notification({ notification }) {
  return (
    <div className="w-full p-3 mt-4 bg-white dark:bg-gray-800 rounded shadow flex flex-shrink-0">
      <div className="w-8 h-8 border rounded-full  border-gray-200 dark:border-gray-500 flex flex-shrink-0 items-center justify-center">
        {NOTIFICATION_ICON[notification.notificationType]}
      </div>
      <div className="pl-3 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm leading-none">
            {notification.notificationType !== "ADMIN" && (
              <span className="dark:text-blue-300 text-blue-300">
                <Link href={`/profile/${notification.username}`}>
                  {notification.username}
                </Link>
              </span>
            )}
            {notification.notification}{" "}
            {notification.notificationType === "POST_REPLY" && (
              <Link href={`/post/${notification.postId}`}>post</Link>
            )}
            {notification.notificationType === "MENTION" && (
              <Link href={`/post/${notification.postId}`}>post</Link>
            )}
            {notification.notificationType === "POST_LIKE" && (
              <a
                href={`/post/${notification.postId}`}
                className="dark:text-blue-300 text-blue-300"
              >
                post
              </a>
            )}
            {notification.notificationType === "MESSAGE" && (
              <a
                href={`/messages`}
                className="dark:text-blue-300 text-blue-300"
              >
                message
              </a>
            )}
          </p>
          <p className="text-xs leading-3 pt-1 text-gray-500">
            {formatDistance(new Date(notification.createdAt), new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
