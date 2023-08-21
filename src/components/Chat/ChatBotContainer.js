import React, { useState } from "react";
import ChatInput from "./ChatInput";
import { toast } from "react-hot-toast";
import OpenAI from "openai";

const BotChatContainer = () => {
  const [messages, setMessages] = useState([]);

  const apiKey = process.env.OPENAI_API_KEY;

  let openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const handleSendMessage = async (message) => {
    try {
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: message });
      setMessages(msgs);

      const params = {
        messages: [{ role: "user", content: message }],
        model: "gpt-3.5-turbo",
      };
      const completion = await openai.chat.completions.create(params);

      console.log("Answer: ", completion);

      msgs.push({
        fromSelf: false,
        message: completion.choices[0].message.content,
      });
      setMessages(msgs);
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="chatcontainer">
        <div>
          <h1 className="chatheader">
            Direct Messages With <i>ChatBot</i>
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
            <div>Start a conversation</div>
          )}
        </div>
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </>
  );
};

export default BotChatContainer;
