import { Navbar } from "~/components/Common/Navbar";
import { SearchResults } from "~/components/Search";

export default function SearchResultsPage() {
  return <SearchResults />;
}

SearchResultsPage.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar />
      {page}
    </>
  );
};
