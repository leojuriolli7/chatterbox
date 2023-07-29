import type { Chat, File, Message, User } from "@prisma/client";

export type FullMessage = Message & {
  sender: User;
  seen: User[];
  files: File[];
};

export type ChatWithMessagesAndUsers = Chat & {
  users: User[];
  messages: FullMessage[];
};
