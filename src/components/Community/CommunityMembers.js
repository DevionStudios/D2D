import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { Heading } from "../ui/Heading";
import { useState } from "react";
import { JoinButton } from "./JoinButton";
import Link from "next/link";
export function AllCommunityUsers({ currentUser }) {
  const [data, setData] = useState([
    {
      fullName: "Person Name",
      username: "username",
      id: 1,
      profileImage: "/assets/user.png",
    },
    {
      fullName: "Person Name",
      username: "username",
      id: 1,
      profileImage: "/assets/user.png",
    },
    {
      fullName: "Person Name",
      username: "username",
      id: 1,
      profileImage: "/assets/user.png",
    },
    {
      fullName: "Person Name",
      username: "username",
      id: 1,
      profileImage: "/assets/user.png",
    },
  ]);
  const router = useRouter();
  if (!data)
    return (
      <ErrorFallback
        action={() => router.reload()}
        message={`Failed to load search result.`}
        buttonText="Try again."
      />
    );

  const users = data;

  return (
    <div className="dark:bg-gray-900 " style={{ marginTop: "100px" }}>
      <div className="flow-root mt-2 px-4 dark:bg-gray-900">
        <ul role="list" className=" divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((edge) => {
              const user = edge;
              if (user) {
                return (
                  <li key={user.id} className="py-4 mx-6">
                    <div className="flex items-center justify-evenly space-x-4">
                      <Link href="#">
                        <div>
                          <div className="flex-shrink-0">
                            <img
                              className="h-20 w-20 rounded-full"
                              src={user.profileImage}
                              alt="user Image"
                            />
                          </div>
                          <div className="pt-2 flex-1 min-w-0">
                            <p className="text-md font-medium truncate">
                              {user.fullName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {"@" + user.username}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div>
                        <Button
                          onClick={() => {
                            // go to profile
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              }
            })
          ) : (
            <ErrorFallback
              action={() => router.back()}
              message={`You have not messaged anyone yet.`}
              buttonText="Go back"
            />
          )}
        </ul>
      </div>
    </div>
  );
}
