"use client";

import EmptyState from "@/components/ui/chat/empty-state";
import useGetActiveChat from "@/hooks/useGetActiveChat";
import { cn } from "@/lib/utils";

export default function ChatsPage() {
  const { isOpen } = useGetActiveChat();

  return (
    <div
      className={cn("lg: pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
}
