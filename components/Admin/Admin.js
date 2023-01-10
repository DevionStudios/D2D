import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import {
  MDBBtn,
  MDBContainer,
  MDBTabs,
  MDBTabsLink,
  MDBTabsItem,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import PostCard from "../Card/PostCard";
import UserCard from "../Card/UserCard";
import axios from "axios";
import { toast } from "react-hot-toast";
import Spinner from "../Spinner";
const Admin = () => {
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/getusers`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log("users", response.data);
      if (response.data.length !== users.length) {
        let tempUsers = response.data;
        tempUsers.sort((a, b) =>
          a.reports.length < b.reports.length ? 1 : -1
        );
        setUsers(tempUsers);
      }
    } catch (e) {
      toast.error("Failed to get users!");
      console.log(e);
    }
  };

  const getPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log("posts", response.data);
      if (response.data.length !== posts.length) {
        let tempPosts = response.data;
        tempPosts.sort((a, b) =>
          a.reports.length < b.reports.length ? 1 : -1
        );
        setPosts(tempPosts);
        let tempComments;
        posts.map((post) => {
          tempComments += post.comments.length;
        });
        setComments(tempComments);
      }
    } catch (e) {
      toast.error("Failed to get users!");
      console.log(e);
    }
  };

  useEffect(() => {
    getUsers();
  }, [users]);

  useEffect(() => {
    getPosts();
  }, [posts]);
  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };
  return (
    <>
      <Navbar />
      <h2 className="text-center mt-5">Statistics</h2>
      <div className="d-flex flex-column justify-content-center py-5">
        <div
          className="mx-5 my-2"
          style={{
            backgroundColor: "#011E19",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <h5>
            No. Of Users:{" "}
            {users?.length === undefined ? <Spinner /> : users?.length}
          </h5>
        </div>
        <div
          className="mx-5 my-2"
          style={{
            backgroundColor: "#011E19",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <h5>
            No. Of Posts:{" "}
            {posts?.length === undefined ? <Spinner /> : posts.length}
          </h5>
        </div>
        <div
          className="mx-5 my-2"
          style={{
            backgroundColor: "#011E19",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <h5>
            No. Of Comments:{" "}
            {comments?.length === undefined ? <Spinner /> : comments?.length}
          </h5>
        </div>
      </div>
      <MDBContainer className="p-3 my-5 d-flex flex-column w-90">
        <MDBTabs
          pills
          justify
          className="mb-3 d-flex flex-row justify-content-between"
        >
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleJustifyClick("tab1")}
              active={justifyActive === "tab1"}
              style={{ color: "white" }}
            >
              Posts
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleJustifyClick("tab2")}
              active={justifyActive === "tab2"}
              style={{ color: "white" }}
            >
              Users
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
        <MDBTabsContent>
          <MDBTabsPane show={justifyActive === "tab1"}>
            <h3 className="text-center mt-5">Posts</h3>
            {posts.map((post, index) => {
              return <PostCard key={index} post={post} />;
            })}
          </MDBTabsPane>
          <MDBTabsPane show={justifyActive === "tab2"}>
            <h3 className="text-center mt-5">Users</h3>
            {users.map((user, index) => {
              return <UserCard key={index} user={user} />;
            })}
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
    </>
  );
};

export default Admin;
