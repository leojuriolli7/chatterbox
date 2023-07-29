import { DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import useGetOtherUser from "@/hooks/useGetOtherUser";
import type { Chat, User } from "@prisma/client";
import { format } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";
import { useMemo } from "react";
import ChatAvatar from "../../chat-avatar";

type Props = Chat & {
  users: User[];
};

export default function ProfileDrawerContent(chat: Props) {
  const otherUser = useGetOtherUser(chat);

  const { name, isGroup, users } = chat;

  const joined = useMemo(
    () => format(new Date(otherUser.createdAt), "PP"),
    [otherUser.createdAt]
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
      <DrawerContent className="fixed right-0 top-0 h-screen z-50 w-full max-w-lg border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  data-[state=closed]:slide-out-to-right-1/2  data-[state=open]:slide-in-from-right-1/2 md:w-full dark:border-neutral-800 dark:bg-neutral-950">
        <div className="relative mt-6 flex-1 px-4 sm:px-6">
          <div className="flex flex-col items-center">
            <div className="mb-2"></div>
            <ChatAvatar
              className="w-14 h-14"
              image={otherUser.image}
              name={otherUser.name}
            />

            <h3 className="mt-2">{title}</h3>

            <p className="text-sm text-neutral-500">{subtitle}</p>

            <div className="flex gap-10 my-8">
              <button
                type="button"
                className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75 transition-opacity"
              >
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>

                <p className="text-sm font-light text-neutral-600">Delete</p>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
          <dl className="space-y-8 px-6 sm:space-y-6 sm:px-6">
            {!isGroup && (
              <>
                <div>
                  <dt className="text-sm font-medium text-neutral-500 sm:w-40 sm:flex-shrink">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900 sm:col-span-2">
                    {otherUser?.email}
                  </dd>
                </div>
                <>
                  <hr />

                  <div>
                    <dt className="text-sm font-medium text-neutral-500 sm:w-40 sm:flex-shrink-0">
                      Joined
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900 sm:col-span-2">
                      <time dateTime={joined}>{joined}</time>
                    </dd>
                  </div>
                </>
              </>
            )}
          </dl>
        </div>
      </DrawerContent>
    </>
  );
}
