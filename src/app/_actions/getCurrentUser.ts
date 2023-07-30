import getServerSideSession from "./getServerSideSession";
import prisma from "@/lib/prisma";

const getCurrentUser = async () => {
  try {
    const session = await getServerSideSession();
    if (!session?.user?.email) return null;

    const currentUser = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (e) {
    return null;
  }
};

export default getCurrentUser;
