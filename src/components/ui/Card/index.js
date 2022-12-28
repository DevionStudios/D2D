import clsx from "clsx";
import React from "react";
import { CardBody } from "./CardBody";
import { CardFooter } from "./CardFooter";

export function Card({
  children,
  container = true,
  rounded = "sm",
  shadow = "none",
  className,
}) {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 ",
        container ? "mx-auto" : "",
        rounded && `rounded-${rounded}`,
        shadow !== "none" && `shadow-${shadow}`,
        className
      )}
    >
      {children}
    </div>
  );
}

Card.Body = CardBody;
Card.Footer = CardFooter;
