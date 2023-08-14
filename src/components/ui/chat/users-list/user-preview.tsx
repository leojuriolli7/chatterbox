"use client";

import type { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import ChatAvatar from "../chat-avatar";
import LoadingDialog from "../../loading-dialog";
import { useSession } from "next-auth/react";
import clsx from "clsx";

export default function UserPreview(user: User) {
  const { id, name, email } = user;
  const { data: session } = useSession();
  const isCurrentUser = session?.user?.email === email;

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onClickUser = useCallback(() => {
    if (isCurrentUser) return;

    fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        userId: id,
      }),
    })
      .then(async (data) => {
        const response = (await data.json()) as { id: string };
        router.push(`/chats/${response.id}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, router, isCurrentUser]);

  return (
    <>
      {loading && <LoadingDialog />}
      <button
        onClick={onClickUser}
        type="button"
        className={clsx(
          "w-full relative flex items-center border border-neutral-200 dark:border-neutral-800 space-x-3 bg-white dark:bg-neutral-925 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-lg transition",
          isCurrentUser && "pointer-events-none"
        )}
      >
        <ChatAvatar {...user} />

        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-400 break-words line-clamp-1">
                {name}{" "}
                {isCurrentUser && (
                  <span className="text-neutral-400 dark:text-neutral-500 text-xs">
                    (You)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </button>
    </>
  );
}
