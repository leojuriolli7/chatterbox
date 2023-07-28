import type { Chat, Message, User } from "@prisma/client";

export type MessageWithStatus = Message & {
  sender: User;
  seen: User[];
};

export type ChatWithMessagesAndUsers = Chat & {
  users: User[];
  messages: MessageWithStatus[];
};
