import { Navbar } from "src/components/Common/Navbar";

import { Create } from "src/components/Post";
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
