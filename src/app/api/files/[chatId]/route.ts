import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: {
    chatId: string;
  };
};

// get all files from a chat.
export async function GET(request: Request, { params: { chatId } }: Params) {
  try {
    const files = await prisma.file.findMany({
      where: {
        message: {
          chatId: chatId,
        },
      },
    });

    return NextResponse.json(files);
  } catch (e) {
    console.log(e);
    return new NextResponse("Error trying to get chat medias.", {
      status: 500,
    });
  }
}
