import prisma from "@/lib/prisma";

export default async function getMessages(chatId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (e) {
    return [];
  }
}
