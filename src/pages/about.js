import { Heading } from "~/components/ui/Heading";
import Spinner from "~/components/ui/Spinner";
import { useUser } from "~/utils/useUser";

export default function About() {
  const { loading, user } = useUser();
  return (
    <div>
      <Heading size="h3">User info</Heading>
      {loading && <Spinner className="w-7 h-7" />}
      <p>{user.username}</p>
    </div>
  );
}
