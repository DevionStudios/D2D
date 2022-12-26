import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Card } from "../ui/Card";
import { HashtagSearchResult } from "./HashtagSearchResult";
import { UserSearchResult } from "./UserSearchResult";
import {
  HashtagSearchQuery,
  HashtagSearchQueryVariables,
  UserSearchQuery,
  UserSearchQueryVariables,
} from "./__generated__/index.generated";

export let SEARCH_FOR_POST_BY_HASHTAG;

export let SEARCH_FOR_USERS_BY_KEYWORD;

export function SearchResults() {
  const router = useRouter();

  const { data: HashtagData } =
    useQuery <
    HashtagSearchQuery(SEARCH_FOR_POST_BY_HASHTAG, {
      variables: {
        first: 10,
        keyword: "#" + router.query.query,
      },
      skip: router.query.type !== "hashtag",
    });

  const { data: UserData } =
    useQuery <
    UserSearchQuery(SEARCH_FOR_USERS_BY_KEYWORD, {
      variables: {
        keyword: router.query.query,
        first: 5,
      },
      skip: router.query.type !== "user",
    });

  return (
    <div className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto overflow-hidden">
        <Card className="mt-2 overflow-hidden" rounded="lg">
          {router.query.type === "hashtag" && (
            <HashtagSearchResult data={HashtagData} />
          )}
          {router.query.type === "user" && <UserSearchResult data={UserData} />}
        </Card>
      </div>
    </div>
  );
}
