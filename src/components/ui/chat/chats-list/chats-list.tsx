"use client";

import useGetActiveChat from "@/hooks/useGetActiveChat";
import { cn } from "@/lib/utils";
import type { ChatWithMessagesAndUsers, UpdateChatEventPayload } from "@/types";
import { UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import ChatPreview from "./chat-preview";
import type { User } from "@prisma/client";
import CreateGroupDialogContent from "./create-group-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { addNewLastMessage, updateSeenFromLastMessage } from "./utils";

type Props = {
  initialChats: ChatWithMessagesAndUsers[];
  users: User[];
};

export default function ChatsList({ initialChats, users }: Props) {
  const { isOpen, chatId } = useGetActiveChat();
  const { data: session } = useSession();
  const router = useRouter();

  const [chats, setChats] = useState(initialChats);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const pusherKey = session?.user?.email;

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (newChat: ChatWithMessagesAndUsers) => {
      setChats((currentChats) => {
        if (currentChats?.some((chat) => chat?.id === newChat.id)) {
          return currentChats;
        }

        return [newChat, ...currentChats];
      });
    };

    const updateHandler = (payload: ChatWithMessagesAndUsers) => {
      setChats((current) => addNewLastMessage(current, payload));
    };

    const updateSeenHandler = (payload: UpdateChatEventPayload) => {
      setChats((current) => updateSeenFromLastMessage(current, payload));
    };

    const removeHandler = (deletedChat: { id: string }) => {
      setChats((current) => [
        ...current.filter((chat) => chat.id !== deletedChat.id),
      ]);

      if (chatId === deletedChat.id) router.push("/chats");
    };

    pusherClient.bind("chat:new", newHandler);
    pusherClient.bind("chat:update", updateHandler);
    pusherClient.bind("chat:updateSeen", updateSeenHandler);
    pusherClient.bind("chat:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("chat:new", newHandler);
      pusherClient.unbind("chat:update", updateHandler);
      pusherClient.unbind("chat:updateSeen", updateSeenHandler);
      pusherClient.unbind("chat:remove", removeHandler);
    };
  }, [chatId, pusherKey, router]);

  return (
    <aside
      className={cn(
        "absolute inset-y-0 pb-20 bg-white dark:bg-neutral-925 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-neutral-200 dark:border-neutral-800",
        isOpen ? "hidden" : "block w-full left-0"
      )}
    >
      <div className="px-5">
        <div className="flex justify-between py-4 sticky top-0 bg-white dark:bg-neutral-925 z-10">
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
