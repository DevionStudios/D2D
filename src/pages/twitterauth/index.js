import { useSession, signIn, signOut } from "next-auth/react";

import { Card } from "src/components/ui/Card";
import { Heading } from "src/components/ui/Heading";

export default function Component() {
  const { data: session } = useSession();
  console.log("session: ", session);

  return (
    <>
      <div className="max-w-7xl mt-24 mx-auto">
        <div className="lg:grid lg:grid-cols-1 lg:gap-x-5">
          <Card>
            <Card.Body>
              <Heading size="h3">Tweets Migration</Heading>
              <p className="text-muted text-sm">
                You can import your 100 most recent tweets here.
              </p>
              <Card.Footer className="flex justify-center">
                {session ? (
                  <>
                    Signed in as {session.user.email} <br />
                    <button onClick={() => signOut()}>Sign out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => signIn()}>Sign in</button>
                  </>
                )}
              </Card.Footer>

              <div className="container pt-5 space-y-6 mx-auto">
                <div className="space-y-4">
                  <div></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
