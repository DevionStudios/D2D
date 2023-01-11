import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Card } from "src/components/ui/Card";
import { Heading } from "src/components/ui/Heading";
import { Link } from "src/components/ui/Link";
import { Followers } from "./Followers";
import { Following } from "./Following";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function Follows({ currentUser }) {
  const router = useRouter();

  const username = router.query.username;
  const name = router.query.name;

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const setUpFollowData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/otheruser/${username}`,
        {
          headers: { cookie: document.cookie },
        }
      );
      setFollowers(response.data.followers);
      setFollowing(response.data.following);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to follow user!");
    }
  };
  useEffect(() => {
    setUpFollowData();
  }, []);

  const handleChange = (idx) => {
    if (idx == 1)
      router.push(`/profile/${username}/follows?name=${name}&type=followers`);
    else
      router.push(`/profile/${username}/follows?name=${name}&type=following`);
  };
  return (
    <>
      <div className="max-w-3xl mx-auto max-h-screen ">
        <Card rounded="lg">
          <Card.Body className="flex space-x-4 items-center sticky top-0 z-10 bg-white dark:bg-gray-800">
            <div>
              <Link href={`/profile/${username}`}>← Back</Link>
            </div>
            <div>
              <Heading size="h4">{name}</Heading>
              <p className="text-muted">@{username}</p>
            </div>
          </Card.Body>

          <Tab.Group
            defaultIndex={router.query.type === "followers" ? 1 : 0}
            onChange={(idx) => handleChange(idx)}
          >
            <Card.Body
              className="sticky top-20 bg-white dark:bg-gray-800 z-10"
              noPadding
            >
              <Tab.List
                className="-mb-px flex border-b border-gray-200 "
                aria-label="Tabs"
              >
                <Tab
                  className={({ selected }) =>
                    clsx(
                      selected
                        ? "border-brand-500 text-brand-600"
                        : "border-transparent text-gray-500 hover:text-brand-700 hover:border-brand-700",
                      "w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm flex-1"
                    )
                  }
                >
                  <p className="text-base font-medium">Following</p>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    clsx(
                      selected
                        ? "border-brand-500 text-brand-600"
                        : "border-transparent text-gray-500 hover:text-brand-700 hover:border-gray-300",
                      "w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm flex-1"
                    )
                  }
                >
                  <p className="text-base font-medium">Followers</p>
                </Tab>
              </Tab.List>
            </Card.Body>
            <Tab.Panels>
              <Tab.Panel>
                <Following
                  username={username}
                  currentUser={currentUser}
                  data={following}
                />
              </Tab.Panel>
              <Tab.Panel>
                <Followers
                  username={username}
                  currentUser={currentUser}
                  data={followers}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Card>
      </div>
    </>
  );
}
