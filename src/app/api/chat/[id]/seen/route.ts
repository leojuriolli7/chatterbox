import getCurrentUser from "@/app/_actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  chatId: string;
};

export async function POST(request: Request, { params }: { params: Params }) {
  try {
    const currentUser = await getCurrentUser();

    const { chatId } = params;

    if (!currentUser?.id)
      return new NextResponse("Unauthorized", { status: 401 });

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!chat) return new NextResponse("Invalid id", { status: 400 });

    const lastMessage = chat.messages.at(-1);

    if (!lastMessage) return NextResponse.json(chat);

    // update the "seen" from last message with the current user.
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (e) {
    console.log(e, "Error in seen API");
    return new NextResponse("Internal error occurred", { status: 500 });
  }
}
