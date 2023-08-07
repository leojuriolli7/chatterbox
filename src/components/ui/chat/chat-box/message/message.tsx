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
  isGroup: boolean;
  canRenderAuthor: boolean;
  canRenderArrow: boolean;
};

function Message({
  isLast,
  isGroup,
  sender,
  seen,
  files,
  body,
  canRenderAuthor,
  canRenderArrow,
  ...message
}: Props) {
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
    <div
      className={cn(
        "flex sm:gap-3 gap-2 pt-2",
        isOwnMessage && "justify-end",
        isLast && "pb-2"
      )}
    >
      <div
        className={cn(
          "sm:h-10 sm:w-10",
          isGroup ? "w-7 h-7" : "w-0 h-0",
          isOwnMessage && "order-2"
        )}
      >
        {canRenderAuthor && (
          <ChatAvatar className="w-full h-full" {...sender} />
        )}
      </div>

      <div
        className={cn(
          "flex flex-col sm:gap-2 gap-1 max-w-[min(65%,600px)]",
          isOwnMessage && "items-end"
        )}
      >
        {canRenderAuthor && (
          <div className="flex items-center gap-1">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {sender.name}
            </p>
          </div>
        )}

        <div
          className={cn(
            "text-sm w-fit break-words relative py-2 px-3 rounded-[7.5px]",
            isOwnMessage
              ? "bg-blue-500 text-white after:bg-blue-500 after:right-0 after:rounded-bl-full"
              : "bg-neutral-100 dark:bg-neutral-700 after:bg-neutral-100 after:dark:bg-neutral-700 after:left-0 after:rounded-br-full",
            canRenderArrow &&
              "after:content-[''] after:absolute after:top-0 after:w-[17px] after:h-[17px]"
          )}
        >
          {hasFiles && <MediaMessage files={files} />}
          <div className={cn(hasFiles && "mt-2")}>
            {body && <span style={{ wordBreak: "break-word" }}>{body}</span>}

            <span
              className={cn(
                "text-[11px] float-right mt-[6px] ml-2 -mr-1 leading-4",
                isOwnMessage ? "text-sky-200" : "text-neutral-400"
              )}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </span>
          </div>
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
