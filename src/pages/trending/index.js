import { FeedLayout } from "~/components/Common/Layouts/FeedLayout";
import { Navbar } from "~/components/Common/Navbar";

export default function FeedPage({ currentUser }) {
  return <FeedLayout currentUser={currentUser} />;
}

FeedPage.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar />
      {page}
    </>
  );
};
