"use client";

import useGetActiveChat from "@/hooks/useGetActiveChat";
import { cn } from "@/lib/utils";
import type { ChatWithMessagesAndUsers } from "@/types";
import { UserPlus2 } from "lucide-react";
import { useState } from "react";
import ChatPreview from "./chat-preview";

type Props = {
  initialChats: ChatWithMessagesAndUsers[];
};

export default function ChatsList({ initialChats }: Props) {
  const { isOpen, chatId } = useGetActiveChat();

  const [chats, _setChats] = useState(initialChats);

  return (
    <aside
      className={cn(
        "absolute inset-y-0 pb-20 bg-white dark:bg-neutral-925 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-neutral-200 dark:border-neutral-800",
        isOpen ? "hidden" : "block w-full left-0"
      )}
    >
      <div className="px-5">
        <div className="flex justify-between my-4">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-400">
            Chats
          </h2>

          <button
            className="rounded-full p-2 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition"
            type="button"
          >
            <span className="sr-only">Create new group chat</span>
            <UserPlus2 />
          </button>
        </div>

        {chats.map((chat) => (
          <ChatPreview key={chat.id} {...chat} selected={chatId === chat.id} />
        ))}
      </div>
    </aside>
  );
}
