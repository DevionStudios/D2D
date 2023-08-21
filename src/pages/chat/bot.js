import React from "react";
import { Navbar } from "../../components/Common/Navbar/index";
import BotChatContainer from "../../components/Chat/ChatBotContainer";

const BotChat = ({ currentUser }) => {
  return (
    <div>
      <Navbar currentUser={currentUser} />
      <BotChatContainer />
    </div>
  );
};

export default BotChat;
