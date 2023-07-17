import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { Heading } from "../ui/Heading";

export function UserMessageResult({ data, currentUser }) {
  const router = useRouter();

  if (!data)
    return (
      <ErrorFallback
        action={() => router.reload()}
        message={`Failed to load search result.`}
        buttonText="Try again."
      />
    );

  const users = data;

  return (
    <div className="dark:bg-gray-900 " style={{ marginTop: "100px" }}>
      <div className="flow-root mt-2 px-4 dark:bg-gray-900">
        <ul role="list" className=" divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((edge) => {
              const user = edge;

              if (user) {
                return (
                  <li key={user.id} className="py-4 mx-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={user.image}
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {"@" + user.username}
                        </p>
                      </div>
                      <div>
                        <Button
                          variant="dark"
                          href={`/chat/${user.id}`}
                          size="lg"
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              }
            })
          ) : (
            <ErrorFallback
              action={() => router.back()}
              message={`You have not messaged anyone yet.`}
              buttonText="Go back"
            />
          )}
        </ul>
      </div>
    </div>
  );
}
