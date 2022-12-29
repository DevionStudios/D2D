import { useRouter } from "next/router";
import { Card } from "../ui/Card";
import { HashtagSearchResult } from "./HashtagSearchResult";
import { UserSearchResult } from "./UserSearchResult";

export let SEARCH_FOR_POST_BY_HASHTAG;

export let SEARCH_FOR_USERS_BY_KEYWORD;

export function SearchResults() {
  const router = useRouter();

  let HashtagData;

  let UserData;

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
