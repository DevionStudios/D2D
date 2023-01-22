import React, { useState } from "react";
import Navbar from "../Navbar";
import { MDBBtn, MDBInput, MDBContainer, MDBCheckbox } from "mdb-react-ui-kit";
import axios from "axios";
import Link from "next/link";
import Spinner from "../Spinner";
import toast, { Toaster } from "react-hot-toast";

const Notification = () => {
  const [notification, setNotification] = useState();
  const [username, setUsername] = useState();
  const [notifyAll, setNotifyAll] = useState(false);
  const [processing, setProcessing] = useState(false);

  const notifyAllUsers = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/notification/createforall`,
        {
          notification: notification,
          notificationType: "ADMIN",
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      toast.success("Notified user!");
    } catch (e) {
      toast.error("Failed to notify users!");
      console.log(e);
    }
  };

  const notifySingleUser = async () => {
    // username must be provided
    if (!username) {
      toast.error("Username must be provided or Notify all users!");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/notification/createforone`,
        {
          username: username,
          notification: notification,
          notificationType: "ADMIN",
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log("notify all users", response.data);
      toast.success("Notified all users!");
    } catch (e) {
      toast.error("Failed to notify users!");
      console.log(e);
    }
  };

  return (
    <>
      <Navbar />

      <form>
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
          <h2 className="mb-4 w-100 text-center">Notification</h2>
          <label>Username</label>
          <MDBInput
            wrapperClass="mb-4"
            className="bg-black text-white"
            type="text"
            id="form6Example5"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Message</label>
          <textarea
            className="mb-4 bg-black text-white"
            id="form4Example3"
            rows={8}
            onChange={(e) => {
              setNotification(e.target.value);
            }}
          />
          <MDBCheckbox
            wrapperClass="d-flex justify-content-center mb-4"
            id="form6Example8"
            label="Notify all users"
            checked={notifyAll}
            onChange={(e) => {
              setNotifyAll(!notifyAll);
            }}
          />
          <MDBBtn
            className="mb-4 w-100"
            onClick={(e) => {
              e.preventDefault();
              setProcessing(true);
              // message must not be empty
              if (!notification) {
                toast.error("Message cannot be empty!");
                setProcessing(false);
                return;
              }

              if (notifyAll) {
                notifyAllUsers();
              } else {
                notifySingleUser();
              }

              setProcessing(false);
            }}
          >
            Notify {processing && <Spinner />}
          </MDBBtn>
          <Toaster />
        </MDBContainer>
      </form>
    </>
  );
};

export default Notification;
