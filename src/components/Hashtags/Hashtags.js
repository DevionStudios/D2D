import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import { Link } from "../ui/Link";
import { SEO } from "../SEO";

export function Hashtags() {
  return (
    <>
      <SEO
        title="Explore trending hashtags · DogeSocial"
        description="View top 10 trending hashtags this week on DogeSocial."
        path={undefined}
      />
      <Card rounded="lg">
        <Card.Body>
          <Heading size="h3">Hashtags.</Heading>
          <p className="text-muted text-base">
            Showing top 10 popular hashtags
          </p>
        </Card.Body>
        <div className="w-full border-t border-gray-300 dark:border-gray-500" />
        <Card.Body noPadding>
          <ul className="divide-y border-gray-300 dark:divide-gray-500">
            {/* {data.popularHashtags.edges.map((edge, index) => {
							return (
								<Link
									key={edge?.cursor}
									className="py-4 px-4  text-lg no-underline flex items-center"
									href={`/search?query=${
										edge?.node.hashtag.split('#')[1]
									}&type=hashtag`}
								>
									{index + 1}. {edge?.node.hashtag}{' '}
									<span className="text-sm ml-2 text-gray-500">
										({edge?.node.postsCount} Posts)
									</span>
								</Link>
							)
						})} */}
          </ul>
        </Card.Body>
      </Card>
    </>
  );
}
