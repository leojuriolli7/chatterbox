"use client";

import useGetActiveChat from "@/hooks/useGetActiveChat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ChatWithMessagesAndUsers, UpdateChatEventPayload } from "@/types";
import { UserPlus2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { User } from "@prisma/client";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import Link from "next/link";
import CreateGroupDialogContent from "./create-group-dialog";
import { addNewLastMessage, updateSeenFromLastMessage } from "./utils";
import ChatPreview from "./chat-preview";

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
  const chatsListRef = useRef<HTMLDivElement>(null);

  const toggleChatModal = (value: boolean) => () => setCreateGroupOpen(value);

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

      const newMessage = payload?.messages?.[0];

      // if the logged in user sent a message,
      // we scroll the list back to the top.
      if (newMessage?.senderId === session.user.id) {
        chatsListRef.current?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
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
  }, [chatId, pusherKey, router, session]);

  return (
    <aside
      ref={chatsListRef}
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

        {!chats.length && (
          <div className="w-full flex flex-col justify-center items-center mt-4">
            <p className="mb-4 text-neutral-500">
              You have no active chats yet.
            </p>
            <Link className="underline text-blue-500 w-full" href="/users">
              <Button variant="brand" type="button" className="w-full">
                Start a chat with a user
              </Button>
            </Link>
            <div className="relative w-full my-3">
              <div className="absolute inset-0 items-center flex">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-neutral-925 px-2 text-neutral-400 dark:text-neutral-400">
                  or
                </span>
              </div>
            </div>
            <Button
              variant="brand"
              type="button"
              onClick={toggleChatModal(true)}
              className="w-full"
            >
              Start a group chat
            </Button>
          </div>
        )}

        {chats.map((chat) => (
          <ChatPreview key={chat.id} {...chat} selected={chatId === chat.id} />
        ))}
      </div>
    </aside>
  );
}
