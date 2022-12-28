import Link from "next/link";

export function CurrentUser({
  avatar,
  firstName,

  username,
}) {
  return (
    <span className="flex w-full justify-between items-center">
      <Link href="/profile/username" passHref>
        <span className="flex min-w-0 items-center justify-between space-x-3">
          <img
            className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
            src={avatar}
            alt="Profile avatar"
          />
          <span className="flex-1 flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{firstName}</span>
            <span className="text-gray-500 text-sm truncate">@{username}</span>
          </span>
        </span>
      </Link>
    </span>
  );
}
