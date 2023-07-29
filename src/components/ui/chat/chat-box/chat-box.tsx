"use client";

import useGetActiveChat from "@/hooks/useGetActiveChat";
import type { FullMessage } from "@/types";
import { useEffect, useRef, useState } from "react";
import Message from "./message/message";
import { pusherClient } from "@/lib/pusher";
import find from "lodash.find";

export default function ChatBox({
  initialMessages,
}: {
  initialMessages: FullMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const { chatId } = useGetActiveChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const messageHandler = (message: FullMessage) => {
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });
    };

    const updateMessageHandler = (newMessage: FullMessage) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) return newMessage;

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [chatId]);

  useEffect(() => {
    void fetch(`/api/chat/${chatId}/seen`, {
      method: "POST",
    });

    bottomRef?.current?.scrollIntoView();
  }, [messages.length, chatId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, i) => (
        <Message
          isLast={i === messages.length - 1}
          key={message.id}
          {...message}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
