import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import OpenAI from "openai";

import ChatInput from "./ChatInput";
import { Button } from "../ui/Button";

function useChatScroll(dep) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref;
}

const BotChatContainer = () => {
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [botResponse, setBotResponse] = useState();
  const ref = useChatScroll(messages);

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  let openai = new OpenAI({
    apiKey: apiKey,
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
      const completion = (await openai.chat.completions.create(params))
        .choices[0].message.content;

      setBotResponse(completion);
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (!botResponse) return;

    const msgs = [...messages];

    msgs.push({
      fromSelf: false,
      message: botResponse,
    });
    setMessages(msgs);
  }, [botResponse]);

  return (
    <>
      <div className="chatcontainer">
        <div>
          <h1 className="chatheader">
            <Button
              className={"w-24 float-left"}
              variant="dark"
              onClick={() => router.back()}
            >
              ← Back
            </Button>
            Direct Messages With <i>Foxxi AI</i>
          </h1>
        </div>
        <div className="messages" id="msg" ref={ref}>
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
