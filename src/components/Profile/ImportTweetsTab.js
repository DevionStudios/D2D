import toast from "react-hot-toast";
import { object, z } from "zod";
import { Card } from "src/components/ui/Card";
import { Heading } from "../ui/Heading";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import axios from "axios";
import { useState } from "react";
import { Button } from "../ui/Button";

const ImportTweetsSchema = object({
  twitterUsername: z.string().min(1, "Twitte Username is required."),
});

export function ImportTweetsTab({ currentUser }) {
  const [loading, setLoading] = useState(false);

  const importTweets = async () => {
    if (!currentUser.twitterUsername || currentUser.twitterUsername === "") {
      toast.error(
        "Please set your twitter username in the edit profile section."
      );
      return;
    }
    // import tweets request
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tweets`,
        {},
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      toast("Your tweets have been imported.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to follow user!");
    }
  };

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <>
      <Card rounded="lg" className="lg:max-w-3xl">
        <Card.Body>
          <Heading size="h3">Tweets Migration</Heading>
          <p className="text-muted text-sm">
            You can import your 100 most recent tweets here.
          </p>

          <div className="container pt-5 space-y-6 mx-auto">
            <div className="space-y-4"></div>
          </div>
        </Card.Body>
        <Card.Footer className="flex justify-center">
          <Button
            onClick={async (values) => {
              await importTweets({
                variables: {
                  input: {
                    twitterUsername: values.twitterUsername,
                  },
                },
              });
            }}
          >
            Import
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}
