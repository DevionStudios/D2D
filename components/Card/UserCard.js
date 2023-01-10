import React, { useState } from "react";
import Spinner from "../Spinner";
import { MDBBtn } from "mdb-react-ui-kit";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const UserCard = ({ user }) => {
  const [isBanned, setIsBanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banLoading, setBanLoading] = useState(false);
  const deleteUser = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users/${user.id}`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response.data);
      window.location.reload({ shallow: true });
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong! Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const banUser = async () => {
    setBanLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users/toggleban`,
        { userId: user.id },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response.data);
      window.location.reload({ shallow: true });
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong! Please try again!");
    } finally {
      setBanLoading(false);
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
            User Id :
          </h5>{" "}
          <span>{user?.id || <Spinner />}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Full Name :
          </h5>
          <span>{user?.name || <Spinner />}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Username :{" "}
          </h5>
          <span>{user?.username || <Spinner />}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Followers :{" "}
          </h5>
          <span>{user?.followers.length}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            Following :
          </h5>{" "}
          <span>{user?.following.length}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            {" "}
            No. of Reports :
          </h5>{" "}
          <span>{user?.reports.length}</span>
        </div>
        <div className="mt-2">
          <h5
            style={{ display: "inline", fontSize: "1.05rem" }}
            className="me-2"
          >
            {" "}
            Is Banned? :
          </h5>{" "}
          <span>{user?.isBanned ? "Yes" : "No"}</span>
        </div>
        <div className="mt-3">
          <MDBBtn
            className="me-1"
            color="danger"
            onClick={async () => {
              await deleteUser();
              toast.success("User Deleted!");
            }}
          >
            Delete {loading && <Spinner />}
          </MDBBtn>
          <MDBBtn
            className="mx-1 "
            color="danger"
            onClick={async () => {
              await banUser();
              if (user.isBanned) toast.success("User Unbanned!");
              else toast.success("User Banned!");
            }}
          >
            {user?.isBanned ? "Unban" : "Ban"} {banLoading && <Spinner />}
          </MDBBtn>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default UserCard;
