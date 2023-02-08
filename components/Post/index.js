import React, { useState } from "react";
import Navbar from "../Navbar";
import { MDBBtn, MDBInput, MDBFile, MDBContainer } from "mdb-react-ui-kit";
import axios from "axios";
import Link from "next/link";
import Spinner from "../Spinner";
import toast, { Toaster } from "react-hot-toast";

const Post = () => {
  const [message, setMessage] = useState();
  const [file, setFile] = useState();
  const [processing, setProcessing] = useState(false);

  const handleCreatePost = async () => {
    try {
      const formdata = new FormData();
      formdata.append("caption", message);
      formdata.append("media", file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/posts/create`,
        formdata,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      toast.success("Post created!");
    } catch (e) {
      toast.error("Failed to create post!");
      console.log(e);
    }
  };

  return (
    <>
      <Navbar />

      <form>
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
          <h2 className="mb-4 w-100 text-center">Post</h2>
          <label>Caption</label>
          <textarea
            className="mb-4 bg-black text-white"
            id="form4Example3"
            rows={4}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <MDBFile
            className="mb-4 w-100"
            id="form4Example3"
            rows={4}
            onChange={(e) => {
              setFile(e.target.value);
            }}
          />
          <MDBBtn
            className="mb-4 w-100"
            onClick={(e) => {
              e.preventDefault();
              setProcessing(true);
              // message must not be empty
              if (!message) {
                toast.error("Message cannot be empty!");
                setProcessing(false);
                return;
              }

              handleCreatePost();
              setProcessing(false);
            }}
          >
            Post {processing && <Spinner />}
          </MDBBtn>
          <Toaster />
        </MDBContainer>
      </form>
    </>
  );
};

export default Post;
