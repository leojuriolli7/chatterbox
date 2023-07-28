import getCurrentUser from "@/app/_actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { getOrCreateDMSchema, createGroupSchema } from "@/schemas/chat.schema";
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
    const groupChatParse = createGroupSchema.safeParse(body);
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

        return NextResponse.json(newDM);
      }
    }
  } catch (e) {
    return new NextResponse("Internal error occurred", { status: 500 });
  }
}
