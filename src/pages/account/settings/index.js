import { AccountPageLayout } from "~/components/Common/Layouts/AccountPageLayout";
import { Navbar } from "~/components/Common/Navbar";

export default function AccountPage() {
  return <AccountPageLayout />;
}

AccountPage.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar />
      {page}
    </>
  );
};
