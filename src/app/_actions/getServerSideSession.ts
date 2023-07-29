import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { cache } from "react";

// wrapper around `getServerSession` to avoid having
// to pass `authOptions` every time.
const getServerSideSession = cache(async () => {
  return await getServerSession(authOptions);
});

export default getServerSideSession;
