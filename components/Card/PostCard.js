import React, { useState } from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import Spinner from "../Spinner";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const PostCard = ({ post }) => {
  const [loading, setLoading] = useState(false);
  const deletePost = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/posts/delete/${post.id}`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response.data);
      toast.success("Post deleted successfully!");
      window.location.reload({ shallow: true });
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong! Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center">
      <div
        className="d-flex flex-column justify-content-center pt-3 pb-3 truncate px-5 w-100  mt-3"
        style={{ borderRadius: "10px", backgroundColor: "#011E19" }}
      >
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Post Id :
          </h5>{" "}
          <span>{post?.id.toString()}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Post Content :
          </h5>
          <span>
            {post?.caption ||
              "Automated Message: No caption was added to this post"}
          </span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Post Author Username :{" "}
          </h5>
          <span>{post?.author.username}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Post Author Id :{" "}
          </h5>
          <span>{post?.author.id}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Is Post Author Banned? :{" "}
          </h5>
          <span>{post?.author.isBanned ? "Yes" : "No"}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Post Likes :{" "}
          </h5>
          <span>{post?.likes.length}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Post Comments :
          </h5>{" "}
          <span>{post?.comments.length}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            {" "}
            No. of Reports :
          </h5>{" "}
          <span>{post?.reports.length}</span>
        </div>
        <div className="mt-3">
          <MDBBtn
            className="me-1"
            color="danger"
            onClick={async () => {
              await deletePost();
              toast.success("Post Deleted!");
            }}
          >
            Delete {loading && <Spinner />}
          </MDBBtn>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default PostCard;
