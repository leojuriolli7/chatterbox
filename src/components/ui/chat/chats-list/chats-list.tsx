"use client";

import useGetActiveChat from "@/hooks/useGetActiveChat";
import { cn } from "@/lib/utils";
import type { ChatWithMessagesAndUsers } from "@/types";
import { UserPlus2 } from "lucide-react";
import { useState } from "react";
import ChatPreview from "./chat-preview";
import type { User } from "@prisma/client";
import CreateGroupDialogContent from "./create-group-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

type Props = {
  initialChats: ChatWithMessagesAndUsers[];
  users: User[];
};

export default function ChatsList({ initialChats, users }: Props) {
  const { isOpen, chatId } = useGetActiveChat();

  const [chats, _setChats] = useState(initialChats);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

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

          <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
            <DialogTrigger asChild>
              <button
                className="rounded-full p-2 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition"
                type="button"
              >
                <span className="sr-only">Create new group chat</span>
                <UserPlus2 />
              </button>
            </DialogTrigger>
            <CreateGroupDialogContent
              users={users}
              onOpenChange={setCreateGroupOpen}
            />
          </Dialog>
        </div>

        {chats.map((chat) => (
          <ChatPreview key={chat.id} {...chat} selected={chatId === chat.id} />
        ))}
      </div>
    </aside>
  );
}
