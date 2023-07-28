import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

// wrapper around `getServerSession` to avoid having
// to pass `authOptions` every time.
export default async function getServerSideSession() {
  return await getServerSession(authOptions);
}
