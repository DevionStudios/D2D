import { Navbar } from "src/components/Common/Navbar";

export default function AccountPage({ currentUser }) {
  return (
    <>
      <Navbar currentUser={currentUser} />
    </>
  );
}
