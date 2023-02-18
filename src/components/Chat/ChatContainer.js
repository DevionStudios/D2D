import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ChatInput from "./ChatInput";
import { IoMdSend } from "react-icons/io";
import { toast, Toaster } from "react-hot-toast";

const ChatContainer = ({ currentUser, otherUser, socket, other }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios["post"](
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getmessages`,
        {
          from: currentUser.id,
          to: otherUser,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response.data);
      setMessages(response.data);
    };
    fetchMessages();
  }, [otherUser]);
  const handleSendMessage = async (message) => {
    try {
      const response = await axios["post"](
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/addmessage`,
        {
          text: message,
          from: currentUser.id,
          to: otherUser,
        },
        {
          headers: {
            cookies: document.cookie,
            withCredentials: true,
          },
        }
      );
      console.log(response.data);
      socket.current.emit("send-msg", {
        to: otherUser,
        message: message,
      });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: message });
      setMessages(msgs);
      const notification = `has sent you `;
      const response2 = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/create`,
        {
          notification: notification,
          userId: otherUser,
          notificationType: "MESSAGE",
          username: currentUser?.username,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response2.data);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    }
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-msg", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  });

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    console.log(messages);
  }, [arrivalMessage]);
  useEffect(() => {
    var objDiv = document.getElementById("msg");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [messages]);
  return (
    <>
      <div className="chatcontainer">
        <div>
          <h1 className="chatheader">
            Direct Messages With{" "}
            <i>
              @
              {other.username?.length > 6
                ? other.username.substring(0, 6) + "..."
                : other.username}
            </i>
          </h1>
        </div>
        <div className="messages" id="msg">
          {messages.length > 0 ? (
            messages.map((message, index) => {
              return (
                <div key={index}>
                  <div
                    className={message.fromSelf ? "myMessage" : "otherMessage"}
                  >
                    <p
                      className={
                        message.fromSelf
                          ? "myMessageContent"
                          : "otherMessageContent"
                      }
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div>no messages</div>
          )}
        </div>
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </>
  );
};

export default ChatContainer;
