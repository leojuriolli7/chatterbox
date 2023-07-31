import getCurrentUser from "@/app/_actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import {
  getOrCreateDMSchema,
  serverCreateGroupSchema,
} from "@/schemas/chat.schema";
import { NextResponse } from "next/server";

/**
 * This route deals with creating or getting DMs or chat groups.
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id && !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: unknown = await request.json();

    // need to identify if the body is valid, and
    // if the request is for a group chat, or DM.
    const groupChatParse = serverCreateGroupSchema.safeParse(body);
    const isGroupChat = groupChatParse.success;

    const directMessageParse = getOrCreateDMSchema.safeParse(body);
    const isDM = directMessageParse.success;

    const invalidBody = !isDM && !isGroupChat;

    if (invalidBody) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroupChat) {
      const { name, members } = groupChatParse.data;

      const newGroupChat = await prisma.chat.create({
        data: {
          name,
          isGroup: true,
          users: {
            connect: [
              ...members.map((memberId) => ({
                id: memberId,
              })),
              {
                // members does not include the currentUser
                id: currentUser?.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      const usersToSend = newGroupChat.users.map((user) => ({
        ...user,
        seenMessageIds: [],
        chatIds: [],
      }));

      await Promise.allSettled(
        newGroupChat.users.map(async (user) => {
          if (user.email) {
            await pusherServer.trigger(user.email, "chat:new", {
              ...newGroupChat,
              users: usersToSend,
            });
          }
        })
      );

      return NextResponse.json(newGroupChat);
    }

    if (isDM) {
      const { userId } = directMessageParse.data;

      const existingDM = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              userIds: {
                equals: [currentUser.id, userId],
              },
            },
            {
              userIds: {
                equals: [userId, currentUser.id],
              },
            },
          ],
        },
      });

      if (!!existingDM) {
        return NextResponse.json(existingDM);
      }

      if (!existingDM) {
        const newDM = await prisma.chat.create({
          data: {
            users: {
              connect: [{ id: currentUser.id }, { id: userId }],
            },
          },
          include: {
            users: true,
          },
        });

        const usersToSend = newDM.users.map((user) => ({
          ...user,
          seenMessageIds: [],
          chatIds: [],
        }));

        await Promise.allSettled(
          newDM.users.map(async (user) => {
            if (user.email) {
              await pusherServer.trigger(user.email, "chat:new", {
                ...newDM,
                users: usersToSend,
              });
            }
          })
        );

        return NextResponse.json(newDM);
      }
    }
  } catch (e) {
    return new NextResponse("Internal error occurred", { status: 500 });
  }
}
