import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card } from "../ui/Card";
import { HashtagSearchResult } from "./HashtagSearchResult";
import { UserSearchResult } from "./UserSearchResult";
import axios from "axios";

export let SEARCH_FOR_POST_BY_HASHTAG;

export let SEARCH_FOR_USERS_BY_KEYWORD;

export function SearchResults({ currentUser }) {
  const router = useRouter();
  const [hashtagData, setHashtagData] = useState({});
  const [userData, setUserData] = useState({});

  const findHashTagPosts = async () => {
    const res = await axios.get(
      `https://foxxi-backend.onrender.com/api/post/search/${router.query.query.toString()}`,
      {
        headers: {
          cookies: document.cookie,
        },
      }
    );
    console.log(res.data);
    setHashtagData(res.data);
  };
  const findUsers = async () => {
    console.log(router.query);
    const res = await axios.get(
      `https://foxxi-backend.onrender.com/api/users/search/${router.query.query.toString()}`,
      {
        headers: {
          cookies: document.cookie,
        },
      }
    );
    console.log(res.data);
    setUserData(res.data);
  };
  useEffect(() => {
    console.log(router.query);
    if (router.query.type === "hashtag") {
      findHashTagPosts();
    } else if (router.query.type === "user") {
      findUsers();
    }
  }, []);
  // ! Insert hashtag posts here
  let HashtagData = {
    searchByHashtag: {
      edges: [
        {
          node: {
            id: "1",
            createdAt: "Janu 1, 12:10 PM",
            isMine: true,
            isLiked: false,
            likes: {
              totalCount: 404,
            },
            caption: "Hi there! I am Neko Chan and I hate cats!",
            // image: "https://placekitten.com/720/480",
            user: {
              id: "1",
              username: "neko_chan",
              avatar: "https://placekitten.com/200/300",
              name: "Neko Chan",
            },
          },
        },
      ],
    },
  };

  // ! Insert user posts here
  let UserData = {
    searchUser: {
      edges: [
        {
          node: {
            id: "1",
            username: "neko_chan",
            avatar: "https://placekitten.com/200/300",
            name: "Neko Chan",
          },
        },
      ],
    },
  };

  return (
    <div className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto overflow-hidden">
        <Card className="mt-2 overflow-hidden" rounded="lg">
          {router.query.type === "hashtag" && hashtagData && (
            <HashtagSearchResult data={hashtagData} currentUser={currentUser} />
          )}
          {router.query.type === "user" && userData && (
            <UserSearchResult data={userData} />
          )}
        </Card>
      </div>
    </div>
  );
}
