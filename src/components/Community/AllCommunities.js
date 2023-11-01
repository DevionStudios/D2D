import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { Heading } from "../ui/Heading";
import { useState } from "react";
import { JoinButton } from "./JoinButton";
import Link from "next/link";
export function AllCommunities({ currentUser, isDiscover }) {
  const [data, setData] = useState([
    {
      id: 1,
      publicName: "Public Name",
      name: "Name",
      avatar: "/assets/community.jpg",
    },
    {
      id: 1,
      publicName: "Public Name",
      name: "Name",
      avatar: "/assets/community.jpg",
    },
    {
      id: 1,
      publicName: "Public Name",
      name: "Name",
      avatar: "/assets/community.jpg",
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

  const communities = data;

  return (
    <div className="dark:bg-gray-900 " style={{ marginTop: "100px" }}>
      <div className="flow-root mt-2 px-4 dark:bg-gray-900">
        <ul role="list" className=" divide-y divide-gray-200">
          {communities.length > 0 ? (
            communities.map((edge) => {
              const community = edge;
              if (community) {
                return (
                  <li key={community.id} className="py-4 mx-6">
                    <div className="flex items-center justify-evenly space-x-4">
                      <Link href="#">
                        <div>
                          <div className="flex-shrink-0">
                            <img
                              className="h-20 w-20 rounded-full"
                              src={community.avatar}
                              alt="Community Image"
                            />
                          </div>
                          <div className="pt-2 flex-1 min-w-0">
                            <p className="text-md font-medium truncate">
                              {community.publicName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {"@" + community.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div>
                        <JoinButton
                          currentUser={currentUser}
                          isJoined={false}
                          size="lg"
                        />
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
