import { PostPageLayout } from "src/components/Common/Layouts/PostPageLayout";
import { Navbar } from "src/components/Common/Navbar";
import { PostCard, POST_QUERY } from "src/components/Post/PostCard";
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
      <PostPageLayout>{page}</PostPageLayout>
    </>
  );
};
