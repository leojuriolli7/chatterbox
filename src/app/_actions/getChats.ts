import prisma from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

export default async function getChats() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) return [];

  try {
    // get DMs or group chats
    const chats = await prisma.chat.findMany({
      orderBy: {
        // order by latest active chat
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
            files: true,
          },
        },
      },
    });

    return chats;
  } catch (e) {
    return [];
  }
}
