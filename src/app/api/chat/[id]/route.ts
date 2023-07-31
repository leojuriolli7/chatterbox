import getCurrentUser from "@/app/_actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: chatId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });

    if (!existingChat) {
      return new NextResponse("Invalid id", { status: 400 });
    }

    const deletedChat = await prisma.chat.deleteMany({
      where: {
        id: chatId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    await Promise.allSettled(
      existingChat.users.map(async (user) => {
        if (user.email) {
          await pusherServer.trigger(user.email, "chat:remove", {
            id: existingChat.id,
          });
        }
      })
    );

    return NextResponse.json(deletedChat);
  } catch (e) {
    console.log(e, "Error deleting message");
    return new NextResponse("Internal error occurred.", { status: 500 });
  }
}
