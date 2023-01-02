import { AccountPageLayout } from "~/components/Common/Layouts/AccountPageLayout";
import { Navbar } from "~/components/Common/Navbar";

export default function AccountPage({ currentUser }) {
  return (
    <>
      <Navbar currentUser={currentUser} />
      <AccountPageLayout currentUser={currentUser} />
    </>
  );
}

AccountPage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
