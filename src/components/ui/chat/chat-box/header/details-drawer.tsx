import { DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import useGetOtherUser from "@/hooks/useGetOtherUser";
import type { Chat, User } from "@prisma/client";
import { format } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import ChatAvatar from "@/components/ui/chat/chat-avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import GroupAvatar from "@/components/ui/chat/group-avatar";
import UserPreview from "@/components/ui/chat/users-list/user-preview";

type Props = Chat & {
  users: User[];
};

export default function DetailsDrawerContent(chat: Props) {
  const otherUser = useGetOtherUser(chat);
  const { toast } = useToast();
  const deleteChatModalState = useState(false);
  const [_, setShowDeleteModal] = deleteChatModalState;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onClickDelete = () => {
    setLoading(true);

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
        setLoading(false);
      });
  };

  const { name, isGroup, users } = chat;

  const dateToDisplay = useMemo(
    () =>
      format(new Date(isGroup ? chat.createdAt : otherUser.createdAt), "PP"),
    [otherUser.createdAt, isGroup, chat.createdAt]
  );

  const title = name || otherUser.name;

  const subtitle = useMemo(() => {
    if (isGroup === true) return `${users.length} members`;

    return "Active";
  }, [isGroup, users]);

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
              <ChatAvatar
                className="w-14 h-14"
                image={otherUser.image}
                name={otherUser.name}
              />
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

        <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
          <dl className="space-y-8 px-6 sm:space-y-6 sm:px-6">
            {isGroup && (
              <>
                <div>
                  <dt className="text-sm font-medium text-neutral-500 sm:w-40 sm:flex-shrink-0">
                    Users
                  </dt>

                  <dd className="mt-1 space-y-2">
                    {users.map((user) => (
                      <UserPreview key={user.id} {...user} />
                    ))}
                  </dd>
                </div>

                <hr className="dark:border-neutral-700" />

                <div>
                  <dt className="text-sm font-medium text-neutral-500 sm:w-40 sm:flex-shrink-0 dark:text-neutral-400">
                    Created at
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900 dark:text-neutral-500 sm:col-span-2">
                    <time dateTime={dateToDisplay}>{dateToDisplay}</time>
                  </dd>
                </div>
              </>
            )}

            {!isGroup && (
              <>
                <div>
                  <dt className="text-sm font-medium text-neutral-500 sm:w-40 sm:flex-shrink dark:text-neutral-400">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:col-span-2 dark:text-neutral-500">
                    {otherUser?.email}
                  </dd>
                </div>
                <>
                  <hr className="dark:border-neutral-700" />

                  <div>
                    <dt className="text-sm font-medium text-neutral-500 sm:w-40 sm:flex-shrink-0 dark:text-neutral-400">
                      Joined
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900 dark:text-neutral-500 sm:col-span-2">
                      <time dateTime={dateToDisplay}>{dateToDisplay}</time>
                    </dd>
                  </div>
                </>
              </>
            )}
          </dl>
        </div>
      </DrawerContent>

      <ConfirmDialog
        onClickDelete={onClickDelete}
        openState={deleteChatModalState}
        confirmButtonMessage="Delete this chat"
        loading={loading}
        title="Are you sure you want to delete this chat?"
      />
    </>
  );
}
