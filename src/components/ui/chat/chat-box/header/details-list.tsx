/* eslint-disable react-hooks/exhaustive-deps */
import type { Chat, FILE_TYPES, File, User } from "@prisma/client";
import UserPreview from "../../users-list/user-preview";
import useGetOtherUser from "@/hooks/useGetOtherUser";
import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useSetAtom } from "jotai";
import { mediaModalAtom } from "@/store/media-modal";
import { isImage, isVideo } from "@/lib/files";
import { useToast } from "@/hooks/useToast";

type PartialFile = {
  url: string;
  id: string;
  type: FILE_TYPES;
};

type Props = Chat & {
  users: User[];
  isDrawerOpen: boolean;
};

const ListItemTitle = ({ children }: { children: React.ReactNode }) => (
  <dt className="text-sm font-medium text-neutral-500 sm:w-40 sm:flex-shrink-0 dark:text-neutral-400">
    {children}
  </dt>
);

const ListItemDescription = ({ children }: { children: React.ReactNode }) => (
  <dd className="mt-1 text-sm text-neutral-900 dark:text-neutral-500 sm:col-span-2">
    {children}
  </dd>
);

export default function ChatDetailsList({ isDrawerOpen, ...chat }: Props) {
  const { isGroup, users } = chat;
  const { toast } = useToast();

  const [fetchingFiles, setFetchingFiles] = useState(true);
  const [chatFiles, setChatFiles] = useState<null | PartialFile[]>(null);
  const chatHasFiles = !!chatFiles?.length;
  const canRenderFiles = fetchingFiles || chatHasFiles;

  const otherUser = useGetOtherUser(chat);

  const setMedia = useSetAtom(mediaModalAtom);
  const onClickMedia = (file: PartialFile) => () =>
    setMedia({ type: file.type, url: file.url });

  const dateToDisplay = useMemo(
    () =>
      format(new Date(isGroup ? chat.createdAt : otherUser.createdAt), "PP"),
    [otherUser.createdAt, isGroup, chat.createdAt]
  );

  useEffect(() => {
    // only fetch when drawer is already open
    if (isDrawerOpen === true)
      fetch(`/api/files/${chat.id}`)
        .then(async (res) => {
          if (res.ok) {
            const response = (await res.json()) as File[];

            const formattedFiles = response.map((file) => ({
              url: file.url,
              id: file.id,
              type: isImage(file) ? "image" : ("video" as FILE_TYPES),
            }));

            setChatFiles(formattedFiles);
          }

          if (!res.ok) {
            toast({
              title: "Error getting chat medias.",
              description: res.statusText,
              variant: "destructive",
            });
          }
        })
        .catch(() => {
          toast({
            title: "An error has occurred.",
            description: "Error getting chat medias.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setFetchingFiles(false);
        });
  }, [isDrawerOpen]);

  return (
    <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
      <dl className="space-y-8 px-6 sm:space-y-6 sm:px-6">
        {isGroup && (
          <>
            <div>
              <ListItemTitle>Users</ListItemTitle>

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
              <ListItemTitle>Email</ListItemTitle>
              <ListItemDescription>{otherUser?.email}</ListItemDescription>
            </div>
            <>
              <hr className="dark:border-neutral-700" />

              <div>
                <ListItemTitle>Joined</ListItemTitle>
                <ListItemDescription>
                  <time dateTime={dateToDisplay}>{dateToDisplay}</time>
                </ListItemDescription>
              </div>
            </>
          </>
        )}

        {canRenderFiles && (
          <div>
            <ListItemTitle>Medias</ListItemTitle>

            <ListItemDescription>
              View all medias chared in this chat
            </ListItemDescription>

            <div className="flex flex-wrap gap-2 w-full mt-3 pb-2">
              {fetchingFiles &&
                [1, 2, 3].map((item) => (
                  <Skeleton className="w-24 h-24" key={item} />
                ))}

              {chatHasFiles &&
                chatFiles.map((file) => {
                  if (isImage(file))
                    return (
                      <Image
                        width={96}
                        height={96}
                        alt="Chat file"
                        src={file.url}
                        key={file.id}
                        className="rounded-md hover:opacity-80 transition-opacity object-cover cursor-pointer w-24 h-24"
                        onClick={onClickMedia(file)}
                      />
                    );

                  if (isVideo(file))
                    return (
                      <video
                        width={96}
                        preload="auto"
                        height={96}
                        className="w-24 h-24 rounded-md object-cover hover:opacity-80 transition-opacity cursor-pointer"
                        src={file.url}
                        key={file.id}
                        onClick={onClickMedia(file)}
                      />
                    );

                  return null;
                })}
            </div>
          </div>
        )}
      </dl>
    </div>
  );
}
