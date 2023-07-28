import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // route will only be accessible to authenticated users.
  if (!session?.user) redirect("/auth/sign-in");

  return <Link href="/auth/sign-in">Go to sign in</Link>;
}
