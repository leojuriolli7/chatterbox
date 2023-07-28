import prisma from "@/lib/prisma";
import getServerSideSession from "./getServerSideSession";

/**
 * Get all users from the database, excluding the logged in user.
 *
 *  TO-DOs:
 *    1. Infinite scrolling
 *    2. Search
 */
export default async function getUsers() {
  const session = await getServerSideSession();

  if (!session?.user?.email) return [];

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (e) {
    return [];
  }
}
