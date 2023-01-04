import { AccountPageLayout } from "src/components/Common/Layouts/AccountPageLayout";
import { Navbar } from "src/components/Common/Navbar";

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
