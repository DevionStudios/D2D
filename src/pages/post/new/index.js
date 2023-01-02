import { Navbar } from "~/components/Common/Navbar";

import { Create } from "~/components/Post";
export default function CreatePage({ currentUser }) {
  return (
    <>
      <Navbar currentUser={currentUser} />
      <Create currentUser={currentUser} />
    </>
  );
}

CreatePage.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar />
      {page}
    </>
  );
};
