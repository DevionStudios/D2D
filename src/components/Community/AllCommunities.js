import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { Heading } from "../ui/Heading";
import { useEffect, useState } from "react";
import { JoinButton } from "./JoinButton";
import Link from "next/link";

export function ActiveMeetings({ currentUser }) {
  const [data, setData] = useState([
    {
      id: 1,
      publicName: "Public Name",
      name: "Name",
      avatar: "/assets/meeting.jpg",
    },
    {
      id: 1,
      publicName: "Public Name",
      name: "Name",
      avatar: "/assets/meeting.jpg",
    },
    {
      id: 1,
      publicName: "Public Name",
      name: "Name",
      avatar: "/assets/meeting.jpg",
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

  const meetings = data;

  // TODO: Fetch all meetings
  const getMeetings = async () => {};

  return (
    <div className="dark:bg-gray-900 " style={{ marginTop: "100px" }}>
      <div className="flow-root mt-2 px-4 dark:bg-gray-900">
        <ul role="list" className=" divide-y divide-gray-200">
          {meetings.length > 0 ? (
            meetings.map((edge) => {
              const meeting = edge;
              if (meeting) {
                return (
                  <li key={meeting.id} className="py-4 mx-6">
                    <div className="flex items-center justify-evenly space-x-4">
                      <Link href="#" passHref>
                        <div>
                          <div className="flex-shrink-0">
                            <img
                              className="h-20 w-20 rounded-full"
                              src={meeting.avatar}
                              alt="meeting Image"
                            />
                          </div>
                          <div className="pt-2 flex-1 min-w-0">
                            <p className="text-md font-medium truncate">
                              {meeting.publicName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {"@" + meeting.name}
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
              message={`There are no active meetings in this meeting.`}
              buttonText="Go back"
            />
          )}
        </ul>
      </div>
    </div>
  );
}
