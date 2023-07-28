import getServerSideSession from "./_actions/getServerSideSession";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSideSession();

  if (!session?.user) redirect("/auth/sign-in");

  if (!!session?.user) redirect("/users");

  return null;
}
