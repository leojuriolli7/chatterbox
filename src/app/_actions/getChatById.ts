import prisma from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

export default async function getChatById(id: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) return null;

    const chat = await prisma.chat.findFirst({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });

    return chat;
  } catch (e) {
    return null;
  }
}
