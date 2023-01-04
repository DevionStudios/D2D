import { AccountPageLayout } from "src/components/Common/Layouts/AccountPageLayout";
import { Navbar } from "src/components/Common/Navbar";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function AccountPage({ currentUser }) {
  const router = useRouter();
  useEffect(() => {
    if (currentUser?.annonymous === true) {
      router.push("/auth/signin");
    }
  }, [currentUser]);

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
