import Link from "next/link";

export function CurrentUser({ currentUser }) {
  return (
    <>
      <span className="flex w-full justify-between items-center">
        <Link
          href={
            currentUser
              ? "/profile/" + currentUser.username
              : "/profile/username"
          }
          passHref
        >
          <span className="flex min-w-0 items-center justify-between space-x-3">
            <img
              className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
              src={
                currentUser
                  ? currentUser.image
                  : "https://placekitten.com/400/400"
              }
              alt="Profile avatar"
            />

            <span className="flex-1 flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {currentUser ? currentUser.name : "Kitten"}
              </span>
              <span className="text-gray-500 text-sm truncate">
                @{currentUser ? currentUser.username : "kitten"}
              </span>
            </span>
          </span>
        </Link>
      </span>
    </>
  );
}
