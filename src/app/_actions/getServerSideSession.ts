import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

// wrapper around `getServerSession` to avoid having
// to pass `authOptions` every time.
const getServerSideSession = async () => {
  return await getServerSession(authOptions);
};

export default getServerSideSession;
