import React, { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import dynamic from "next/dynamic";
function ChatInput({ handleSendMessage }) {
  const emojiStyle = {
    position: "absolute",
    top: "-350px",
    backgroundColor: "#080420",
    boxShadow: "0 5px 10px #A10035",
    borderColor: "#600020",
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (message.length > 0) {
      handleSendMessage(message);
      setMessage("");
    }
  };
  return (
    <div>
      <div>
        <form
          onSubmit={(e) => {
            sendChat(e);
          }}
        >
          <input
            className="sendmessage"
            type="text"
            placeholder="Type message here"
            value={message}
            style={{ color: "black" }}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button className="sendbutton">
            <IoMdSend />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatInput;
