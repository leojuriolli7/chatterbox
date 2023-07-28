import useGetOtherUser from "@/hooks/useGetOtherUser";
import { cn } from "@/lib/utils";
import type { ChatWithMessagesAndUsers } from "@/types";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";
import ChatAvatar from "../chat-avatar";

type Props = ChatWithMessagesAndUsers & {
  selected?: boolean;
};

export default function ChatPreview({ selected, ...chat }: Props) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const otherUser = useGetOtherUser(chat);
  const { messages, id, name } = chat;

  const last = useMemo(() => {
    const chatMessages = messages || [];

    return chatMessages.at(-1);
  }, [messages]);

  const hasSeen = useMemo(() => {
    if (!last) return false;

    const seenArray = last.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.some((user) => user.email === userEmail);
  }, [last, userEmail]);

  const lastMessageText = useMemo(() => {
    if (!!last?.image) return "Sent an image";

    if (!!last?.body) return last?.body;

    return "Started a chat";
  }, [last]);

  return (
    <Link href={`/chats/${id}`}>
      <div
        className={cn(
          "w-full relative flex items-center border border-neutral-200 dark:border-neutral-800 space-x-3 bg-white dark:bg-neutral-925 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-lg transition",
          selected ? "bg-neutral-100" : "bg-white"
        )}
      >
        <ChatAvatar
          name={otherUser?.name as string}
          image={otherUser?.image as string}
        />

        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-400 break-words line-clamp-1">
                {name || otherUser?.name}
              </p>
              {last?.createdAt && (
                <p className="text-xs text-neutral-500 font-light">
                  {format(new Date(last?.createdAt), "p")}
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
