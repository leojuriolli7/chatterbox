import getCurrentUser from "@/app/_actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { editProfileSchema } from "@/schemas/profile.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id && !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: unknown = await request.json();

    const bodyParsing = editProfileSchema.safeParse(body);

    if (!bodyParsing.success) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const { avatar, name } = bodyParsing.data;

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image: avatar,
        name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (e) {
    console.log(e, "Error updating profile");
    return new NextResponse("Internal error occurred.", { status: 500 });
  }
}
