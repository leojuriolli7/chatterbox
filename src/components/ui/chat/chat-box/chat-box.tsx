"use client";

import useGetActiveChat from "@/hooks/useGetActiveChat";
import type { FullMessage } from "@/types";
import { useEffect, useState } from "react";
import Message from "./message/message";

export default function ChatBox({
  initialMessages,
}: {
  initialMessages: FullMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const { chatId } = useGetActiveChat();

  useEffect(() => {
    void fetch(`/api/chat/${chatId}/seen`, {
      method: "POST",
    });
  }, [chatId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, i) => (
        <Message
          isLast={i === messages.length - 1}
          key={message.id}
          {...message}
        />
      ))}
    </div>
  );
}
