import type { Chat, File, Message, User } from "@prisma/client";

export type MessageWithStatus = Message & {
  sender: User;
  seen: User[];
  files: File[];
};

export type ChatWithMessagesAndUsers = Chat & {
  users: User[];
  messages: MessageWithStatus[];
};
