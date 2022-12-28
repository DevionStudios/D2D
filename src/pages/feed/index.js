import { FeedLayout } from "~/components/Common/Layouts/FeedLayout";
import { Navbar } from "~/components/Common/Navbar";

export default function FeedPage() {
  return <FeedLayout />;
}

FeedPage.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar />
      {page}
    </>
  );
};
