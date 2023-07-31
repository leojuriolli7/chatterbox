/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useGetActiveChat from "@/hooks/useGetActiveChat";
import type { FullMessage, SeenEventPayload } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import Message from "./message/message";
import { pusherClient } from "@/lib/pusher";
import useOnScreen from "@/hooks/useOnScreen";
import { useSession } from "next-auth/react";
import ChatMediaModal from "./media-modal";

export default function ChatBox({
  initialMessages,
}: {
  initialMessages: FullMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { chatId } = useGetActiveChat();
  const { data: session } = useSession();

  const lastMessage = useMemo(() => messages.at(-1), [messages]);

  const listRef = useRef<HTMLDivElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useOnScreen(bottomRef);
  const scrollToBottom = () => bottomRef?.current?.scrollIntoView();

  const onClickNewMessageIndicator = () => {
    scrollToBottom();
    setHasNewMessage(false);
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const messageHandler = (newMessage: FullMessage) => {
      setMessages((current) => {
        if (current?.some((m) => m?.id === newMessage.id)) {
          return current;
        }

        return [...current, newMessage];
      });
    };

    const updateMessageHandler = (newMessage: SeenEventPayload) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id)
            return {
              ...currentMessage,
              seen: newMessage.seen,
              seenIds: newMessage.seenIds,
            };

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
    // if user is not at bottom, alert when new messages from other people come in.
    const userIsSender = lastMessage?.sender.email === session?.user?.email;

    if (!userIsSender) {
      if (!isAtBottom) setHasNewMessage(true);

      if (isAtBottom) scrollToBottom();
    }

    // scroll to bottom if user sends a new message.
    if (userIsSender) {
      scrollToBottom();
    }
  }, [lastMessage]);

  useEffect(() => {
    // when entering a chat, mark as seen.
    void fetch(`/api/chat/${chatId}/seen`, {
      method: "POST",
    });

    scrollToBottom();
    setHasNewMessage(false);
  }, [chatId]);

  useEffect(() => {
    const userHasNotReadLastMessage = !lastMessage?.seen.some(
      (user) => user.email === session?.user?.email
    );

    const listCanScroll = listRef.current
      ? listRef.current.clientHeight < listRef.current.scrollHeight
      : undefined;

    const canMarkAsSeen = isAtBottom || !listCanScroll;
    if (canMarkAsSeen && userHasNotReadLastMessage) {
      void fetch(`/api/chat/${chatId}/seen`, {
        method: "POST",
      });
    }
  }, [isAtBottom, lastMessage]);

  return (
    <div className="relative flex-1 overflow-y-auto" ref={listRef}>
      {hasNewMessage && (
        <button
          onClick={onClickNewMessageIndicator}
          className="w-full animate-accordion-down sticky z-20 top-0 left-0 p-1 rounded-b-md shadow-lg bg-blue-500 hover:bg-blue-600 transition-colors flex justify-between"
          type="button"
        >
          <p className="text-white text-sm">New message received</p>
          <p className="text-white text-sm">Click to scroll down</p>
        </button>
      )}
      {messages?.map((message, i) => (
        <Message
          isLast={i === messages.length - 1}
          key={message.id}
          {...message}
        />
      ))}
      <div ref={bottomRef} className="h-1 w-full" />

      <ChatMediaModal />
    </div>
  );
}
