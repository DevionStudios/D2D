import { Navbar } from "~/components/Common/Navbar";

import { Create } from "~/components/Post";
export default function CreatePage() {
  return <Create />;
}

CreatePage.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar />
      {page}
    </>
  );
};
