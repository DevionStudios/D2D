import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "../ui/Card";
import { HashtagSearchResult } from "./HashtagSearchResult";
import { UserSearchResult } from "./UserSearchResult";
import axios from "axios";

export function SearchResults({ currentUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hashtagData, setHashtagData] = useState({});
  const [userData, setUserData] = useState({});

  const findHashTagPosts = async () => {
    const res = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/post/search/${router.query.query.toString()}`,
      {
        headers: {
          cookies: document.cookie,
        },
      }
    );
    setHashtagData(res.data);
    setLoading(false);
  };
  const findUsers = async () => {
    const res = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/users/search/${router.query.query.toString()}`,
      {
        headers: {
          cookies: document.cookie,
        },
      }
    );
    setUserData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (router.query.type === "hashtag") {
      findHashTagPosts();
    } else if (router.query.type === "user") {
      findUsers();
    }
  }, []);

  return (
    <div className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto overflow-hidden">
        <Card className="mt-2 overflow-hidden" rounded="lg">
          {router.query.type === "hashtag" && hashtagData && (
            <HashtagSearchResult
              data={hashtagData}
              currentUser={currentUser}
              loading={loading}
            />
          )}
          {router.query.type === "user" && userData && (
            <UserSearchResult data={userData} loading={loading} />
          )}
        </Card>
      </div>
    </div>
  );
}
