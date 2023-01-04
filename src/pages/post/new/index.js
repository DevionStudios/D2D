import { Navbar } from "src/components/Common/Navbar";

import { Create } from "src/components/Post";

import { useRouter } from "next/router";
import { useEffect } from "react";
export default function CreatePage({ currentUser }) {
  const router = useRouter();

  useEffect(() => {
    if (currentUser?.annonymous === true) {
      router.push("/auth/signin");
    }
  }, [currentUser]);
  return (
    <>
      <Navbar currentUser={currentUser} />
      <Create currentUser={currentUser} />
    </>
  );
}

CreatePage.getLayout = function getLayout(page) {
  return <>{page}</>;
};
