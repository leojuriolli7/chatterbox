"use client";

import useGetOtherUser from "@/hooks/useGetOtherUser";
import type { Chat, User } from "@prisma/client";
import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import ChatAvatar from "../chat-avatar";

type Props = Chat & {
  users: User[];
};

export default function Header(chat: Props) {
  const otherUser = useGetOtherUser(chat);

  const statusText = useMemo(() => {
    if (chat.isGroup === true) {
      return `${chat.users.length} members`;
    }

    return "Active";
  }, [chat.users, chat.isGroup]);

  return (
    <div className="bg-white dark:bg-neutral-800 dark:border-none w-full flex border-b sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          className="lg:hidden block text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          href="/chat"
        >
          <span className="sr-only">Go back to chat list</span>

          <ChevronLeft className="h-8 w-8" />
        </Link>

        <ChatAvatar
          name={otherUser?.name as string}
          image={otherUser?.image as string}
        />

        <div className="flex flex-col">
          <h3 className="line-clamp-1 max-w-[600px] break-words">
            {chat?.name || otherUser?.name}
          </h3>

          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400">
            {statusText}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="text-blue-500 hover:text-blue-600 transition-colors"
      >
        <MoreVertical className="w-7 h-7" />
      </button>
    </div>
  );
}
