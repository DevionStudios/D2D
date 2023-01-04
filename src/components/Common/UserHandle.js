import { Link } from "next/link";
import Image from "next/image";

export function UserHandle({ currentUser }) {
  const user = currentUser;
  return (
    <>
      <div className="flex-shrink-0">
        <Link href={`/profile/${user.username}`} passHref>
          <Image
            className="h-10 w-10 rounded-full object-cover"
            src={user.avatar}
            width="40px"
            height="40px"
            alt="User Avatar"
          />
        </Link>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{user.name}</p>
        <p className="text-sm text-gray-500 truncate">{"@" + user.username}</p>
        <p className="text-sm truncate pt-1">{user.bio ? user.bio : ""}</p>
      </div>
    </>
  );
}
