import { PostPageLayout } from "~/components/Common/Layouts/PostPageLayout";
import { Navbar } from "~/components/Common/Navbar";
import { PostCard, POST_QUERY } from "~/components/Post/PostCard";
import { useRouter } from "next/router";
export default function Post({ currentUser }) {
  const router = useRouter();
  const id = router.query.id;
  return (
    <div className="mt-20">
      <PostCard
        id={id}
        username={currentUser.username}
        currentUser={currentUser}
      />
    </div>
  );
}

Post.getLayout = function getLayout(page) {
  return (
    <>
      <Navbar />
      <PostPageLayout>{page}</PostPageLayout>
    </>
  );
};
