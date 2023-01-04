import { Navbar } from "src/components/Common/Navbar";
import { SearchResults } from "src/components/Search";
// import { authenticatedRoute } from "src/utils/redirection";

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
