import { UserHandle } from "../Common/UserHandle";
import { FollowButton } from "../Profile/FollowButton";
import { Card } from "../ui/Card";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import Spinner from "../ui/Spinner";

export function Step2() {
  return (
    <div className="space-y-4 my-6">
      <Card rounded="lg" shadow="lg">
        <Card.Body>
          <div className="text-2xl font-bold">Suggested people to follow</div>
          <div className="text-gray-500">
            Follow users to get their updates on your feed. Follow atleast one
            to explore posts.
          </div>
        </Card.Body>

        {/* <Card.Body className="max-h-96 overflow-y-scroll">
					<ul role="list" className=" divide-y">
						{data.whoToFollow.edges.map((edge) => {
							return (
								<li
									key={edge?.node.id}
									className="py-4 px-5 hover:bg-gray-100 dark:hover:bg-gray-900 hover:rounded-lg"
								>
									<div className="flex items-center space-x-4 ">
										<UserHandle user={edge?.node!} />
										<FollowButton
											variant="dark"
											isFollowing={false}
											username={edge?.node.username!}
										/>
									</div>
								</li>
							)
						})}
					</ul>
				</Card.Body> */}
      </Card>
    </div>
  );
}
