import React from "react";

export function Url({ children, href, url }) {
  let nextUrl = href || url || "";

  if (!url.match(/^https?:\/\//)) {
    nextUrl = `http://${url}`;
  }

  function handleOnClick() {
    window.open(nextUrl);
  }

  return (
    <span className="truncate block">
      <button
        onClick={handleOnClick}
        className="truncate font-medium dark:text-gray-100 underline focus:outline-none hover:text-opacity-80 focus:ring-2 focus:ring-gray-500"
      >
        {children}
      </button>
    </span>
  );
}
