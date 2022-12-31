import { Status } from "~/components/ui/StatusPages/Status";

export default function FourOFour({ currentUser }) {
  return <Status statusCode="404" href={!currentUser ? "/" : "/feed/"} />;
}
