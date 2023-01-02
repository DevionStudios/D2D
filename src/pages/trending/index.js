import { FeedLayout } from "~/components/Common/Layouts/FeedLayout";
import { Navbar } from "~/components/Common/Navbar";

export default function FeedPage({ currentUser }) {
  return (
    <>
      <Navbar currentUser={currentUser} />
      <FeedLayout currentUser={currentUser} />
    </>
  );
}

FeedPage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
