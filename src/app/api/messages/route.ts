import getCurrentUser from "@/app/_actions/getCurrentUser";
import { createMessageSchema } from "@/schemas/chat.schema";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email)
      return new NextResponse("Unauthorized", { status: 401 });

    const body: unknown = await request.json();

    const bodyParsing = createMessageSchema.safeParse(body);

    if (!bodyParsing.success) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const { chatId, files, message } = bodyParsing.data;

    const newMessage = await prisma.message.create({
      data: {
        ...(message && { body: message }),
        files: files
          ? {
              create: files.map(({ type, url }) => ({
                type,
                url,
              })),
            }
          : {},
        chat: {
          connect: {
            id: chatId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
        files: true,
      },
    });

    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },

      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage?.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            files: true,
          },
        },
      },
    });

    const newMessageToSend = {
      ...newMessage,
      seen: [
        {
          ...newMessage.seen[0],
          chatIds: [],
          seenMessageIds: [],
        },
      ],
      sender: {
        ...newMessage.sender,
        chatIds: [],
        seenMessageIds: [],
      },
    };

    await pusherServer.trigger(chatId, "messages:new", newMessageToSend);

    const lastMessage = updatedChat?.messages.at(-1);

    const userToSend = currentUser;
    userToSend.chatIds = [];
    userToSend.seenMessageIds = [];

    const messageToSend = {
      ...lastMessage,
      seen: [userToSend],
    };

    await Promise.allSettled(
      updatedChat?.users.map(async (user) => {
        await pusherServer.trigger(user.email as string, "chat:update", {
          id: chatId,
          messages: [messageToSend],
        });
      })
    );

    return NextResponse.json(newMessage);
  } catch (e) {
    console.log(e, "Error creating message");

    return new NextResponse("Internal error occured", { status: 500 });
  }
}
