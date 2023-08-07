import useGetOtherUser from "@/hooks/useGetOtherUser";
import { cn } from "@/lib/utils";
import type { ChatWithMessagesAndUsers } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";
import ChatAvatar from "../chat-avatar";
import GroupAvatar from "../group-avatar";
import { formatLastMessageDate } from "./utils";

type Props = ChatWithMessagesAndUsers & {
  selected?: boolean;
};

export default function ChatPreview({ selected, ...chat }: Props) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const otherUser = useGetOtherUser(chat);
  const { messages, id, name } = chat;

  const last = (messages || []).at(-1);

  const hasSeen = useMemo(() => {
    if (!last) return false;

    if (!userEmail) {
      return false;
    }

    const seenArray = last?.seen || [];

    return seenArray.some((user) => user.email === userEmail);
    // necessary because this was not updating when
    // user read the last message.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last, userEmail, last?.seenIds.length]);

  const lastMessageText = useMemo(() => {
    const sender = last?.sender;

    const isAnotherUser =
      !!sender &&
      !!session?.user?.email &&
      sender?.email !== session?.user?.email;

    const canRenderPrefix = isAnotherUser && chat.isGroup === true;
    const firstName = sender?.name?.split(" ")?.[0] || "";

    const messagePrefix = canRenderPrefix ? `${firstName}: ` : "";
    const getText = (value: string) => `${messagePrefix}${value}`;

    if (!!last?.body) return getText(last.body);

    if (!!last?.files) return getText("📷 Sent media");

    return "Started a chat";
  }, [last, session, chat?.isGroup]);

  return (
    <Link href={`/chats/${id}`}>
      <div
        aria-current={selected}
        className={cn(
          "w-full mb-2 relative flex items-center border border-neutral-200 dark:border-neutral-800 space-x-3 bg-white dark:bg-neutral-925 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-lg transition",
          selected ? "bg-neutral-100 dark:bg-neutral-800/60" : "bg-white"
        )}
      >
        {chat.isGroup ? (
          <GroupAvatar users={chat.users} />
        ) : (
          <ChatAvatar {...otherUser} />
        )}

        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-400 break-words line-clamp-1">
                {name || otherUser?.name}
              </p>
              {last?.createdAt && (
                <p className="text-xs text-neutral-500 font-light">
                  {formatLastMessageDate(last?.createdAt)}
                </p>
              )}
            </div>

            <p
              className={cn(
                "line-clamp-1 break-words text-sm",
                hasSeen ? "text-neutral-500" : "text-blue-500 font-medium"
              )}
            >
              {lastMessageText}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
