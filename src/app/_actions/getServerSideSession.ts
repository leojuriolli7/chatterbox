import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// wrapper around `getServerSession` to avoid having
// to pass `authOptions` every time.
const getServerSideSession = async () => {
  return await getServerSession(authOptions);
};

export default getServerSideSession;
