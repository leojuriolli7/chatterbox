import { DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import useGetOtherUser from "@/hooks/useGetOtherUser";
import type { Chat, User } from "@prisma/client";
import { MoreVertical, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import ChatAvatar from "@/components/ui/chat/chat-avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import GroupAvatar from "@/components/ui/chat/group-avatar";
import { useAtomValue } from "jotai";
import { activeUsersAtom } from "@/store/active-users";
import ChatDetailsList from "./details-list";

export type Props = Chat & {
  users: User[];
  isOpen: boolean;
};

export default function DetailsDrawerContent({ isOpen, ...chat }: Props) {
  const otherUser = useGetOtherUser(chat);
  const { toast } = useToast();
  const router = useRouter();

  const deleteChatModalState = useState(false);
  const [_, setShowDeleteModal] = deleteChatModalState;

  const [deletingChat, setDeletingChat] = useState(false);

  const members = useAtomValue(activeUsersAtom);
  const isActive = members.indexOf(otherUser?.email as string) !== -1;

  const onClickDelete = () => {
    setDeletingChat(true);

    fetch(`/api/chat/${chat.id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setShowDeleteModal(false);
          router.push("/chats");
          router.refresh();
        }

        if (!res.ok) {
          toast({
            title: "Couldn't delete your message",
            description: res.statusText,
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Couldn't delete your message",
        });
      })
      .finally(() => {
        setDeletingChat(false);
      });
  };

  const { name, isGroup, users } = chat;

  const title = name || otherUser.name;

  const subtitle = useMemo(() => {
    if (isGroup === true) return `${users.length} members`;

    return isActive ? "Active" : "Offline";
  }, [isGroup, users, isActive]);

  return (
    <>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          <span className="sr-only">Click to see options for this chat</span>
          <MoreVertical className="w-7 h-7" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="relative mt-6 flex-1 px-4 sm:px-6">
          <div className="flex flex-col items-center">
            <div className="mb-2"></div>
            {isGroup ? (
              <GroupAvatar users={chat.users} size="medium" />
            ) : (
              <ChatAvatar className="w-14 h-14" {...otherUser} />
            )}

            <h3 className="mt-2">{title}</h3>

            <p className="text-sm text-neutral-500">{subtitle}</p>

            <div className="flex gap-10 my-8">
              <button
                type="button"
                className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => setShowDeleteModal(true)}
              >
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center dark:bg-neutral-600 dark:text-neutral-400">
                  <Trash2 className="w-5 h-5" />
                </div>

                <p className="text-sm font-light text-neutral-600 dark:text-neutral-500">
                  Delete
                </p>
              </button>
            </div>
          </div>
        </div>

        <ChatDetailsList {...chat} isDrawerOpen={isOpen} />
      </DrawerContent>

      <ConfirmDialog
        onClickDelete={onClickDelete}
        openState={deleteChatModalState}
        confirmButtonMessage="Delete this chat"
        loading={deletingChat}
        title="Are you sure you want to delete this chat?"
      />
    </>
  );
}
