"use client";

import type { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import ChatAvatar from "../chat-avatar";

export default function UserPreview({ id, name, image }: User) {
  const [_loading, setLoading] = useState(false);
  const router = useRouter();

  const onClickUser = useCallback(() => {
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
  }, [id, router]);

  return (
    <button
      onClick={onClickUser}
      type="button"
      className="w-full relative flex items-center border border-neutral-200 dark:border-neutral-800 space-x-3 bg-white dark:bg-neutral-925 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-lg transition"
    >
      <ChatAvatar name={name} image={image} />

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-400 break-words line-clamp-1">
              {name}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
