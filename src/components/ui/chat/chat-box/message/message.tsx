import { cn } from "@/lib/utils";
import type { FullMessage } from "@/types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import ChatAvatar from "../../chat-avatar";
import { format } from "date-fns";
import MediaMessage from "./media-message";

type Props = FullMessage & {
  isLast: boolean;
};

export default function Message({
  isLast,
  sender,
  seen,
  files,
  body,
  ...message
}: Props) {
  const { data: session } = useSession();
  const isOwnMessage = session?.user?.email === sender.email;
  const hasFiles = !!files.length;

  /** Get all users that have seen a message, except the author. */
  const seenList = useMemo(() => {
    return (seen || [])
      .filter((user) => user.email !== sender.email)
      .map((user) => user.name)
      .join(", ");
  }, [seen, sender]);

  return (
    <div className={cn("flex gap-3 p-4", isOwnMessage && "justify-end")}>
      <div className={cn(isOwnMessage && "order-2")}>
        <ChatAvatar image={sender.image} name={sender.name} />
      </div>

      <div className={cn("flex flex-col gap-2", isOwnMessage && "items-end")}>
        <div className="flex items-center gap-1">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {sender.name}
          </p>

          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {format(new Date(message.createdAt), "p")}
          </p>
        </div>

        <div
          className={cn(
            "text-sm w-fit break-words py-2 px-3",
            isOwnMessage ? "bg-blue-500 text-white" : "bg-neutral-100",
            hasFiles ? "rounded-md" : "rounded-full"
          )}
        >
          {hasFiles && <MediaMessage files={files} />}
          {body && <p className={cn(hasFiles && "mt-2")}>{body}</p>}
        </div>
      </div>
    </div>
  );
}