import { Navbar } from "~/components/Common/Navbar";
import { SearchResults } from "~/components/Search";
// import { authenticatedRoute } from "~/utils/redirection";

export default function SearchResultsPage({ currentUser }) {
  return (
    <>
      <Navbar currentUser={currentUser} />
      <SearchResults currentUser={currentUser} />
    </>
  );
}

SearchResultsPage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
