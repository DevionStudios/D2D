import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import { Navbar } from "~/components/Common/Navbar";
import { SearchResults } from "~/components/Search";
import { authenticatedRoute } from "~/utils/redirection";

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
