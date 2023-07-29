import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";

// wrapper around `getServerSession` to avoid having
// to pass `authOptions` every time.
export default async function getServerSideSession() {
  return await getServerSession(authOptions);
}
