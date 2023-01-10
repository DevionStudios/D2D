import clsx from "clsx";
import React from "react";
import {
  HiExclamation,
  HiXCircle,
  HiCheckCircle,
  HiInformationCircle,
} from "react-icons/hi";

const STATUS_ICON = {
  error: { icon: HiXCircle, color: "red" },
  success: { icon: HiCheckCircle, color: "green" },
  info: { icon: HiInformationCircle, color: "blue" },
  warning: { icon: HiExclamation, color: "blue" },
};

export function Alert({ message, status }) {
  const Icon = STATUS_ICON[status].icon;
  const color = STATUS_ICON[status].color;

  return (
    <div
      className={clsx(
        "p-4 md:p-5 rounded-md max-w-md border",
        color === "red" && `bg-red-100 border-red-300 dark:bg-red-200`,
        color === "green" && "bg-green-100 border-green-300 dark:bg-green-200",
        color === "blue" && "bg-blue-100 border-blue-300 dark:bg-blue-200",
        color === "blue" && "bg-blue-100 border-blue-300 dark:bg-blue-200"
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon
            className={clsx(
              "h-5 w-5",
              color === "red" && `text-red-400`,
              color === "green" && "text-green-400",
              color === "blue" && "text-blue-400",
              color === "blue" && "text-blue-400"
            )}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3
            className={clsx(
              "text-sm font-medium ",
              color === "red" && `text-red-800`,
              color === "green" && "text-green-800",
              color === "blue" && "text-blue-800",
              color === "blue" && "text-blue-800"
            )}
          >
            {message}
          </h3>
        </div>
      </div>
    </div>
  );
}
