import { cn } from "@/lib/utils";
import type { FullMessage } from "@/types";
import { useSession } from "next-auth/react";
import { memo, useMemo } from "react";
import ChatAvatar from "../../chat-avatar";
import { format } from "date-fns";
import MediaMessage from "./media-message";
import { formatNames } from "@/lib/format-names";

type Props = FullMessage & {
  isLast: boolean;
};

function Message({ isLast, sender, seen, files, body, ...message }: Props) {
  const { data: session } = useSession();
  const isOwnMessage = session?.user?.email === sender.email;
  const hasFiles = !!files?.length;

  /**
   * Takes the `seen` object and transforms into list of users
   * that have read the last message.
   *
   * Output: "Seen by name1, name2 and X more"
   */
  const seenList = useMemo(() => {
    const arrayOfNames = (seen || [])
      .filter((user) => user.email !== sender.email)
      .map((user) => user.name as string);

    return formatNames(arrayOfNames);
  }, [seen, sender]);

  return (
    <div className={cn("flex gap-3 p-4", isOwnMessage && "justify-end")}>
      <div className={cn(isOwnMessage && "order-2")}>
        <ChatAvatar {...sender} />
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
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-neutral-100 dark:bg-neutral-700",
            hasFiles ? "rounded-md" : "rounded-full"
          )}
        >
          {hasFiles && <MediaMessage files={files} />}
          {body && <p className={cn(hasFiles && "mt-2")}>{body}</p>}
        </div>
        {isLast && isOwnMessage && seenList.length > 0 && (
          <p className="text-xs font-light text-neutral-500">
            {`Seen by ${seenList}`}
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(Message);
