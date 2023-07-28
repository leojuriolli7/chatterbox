import Sidebar from "@/components/ui/chat/nav/sidebar";
import getServerSideSession from "../_actions/getServerSideSession";
import { redirect } from "next/navigation";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSideSession();

  // route will only be accessible to authenticated users.
  if (!session?.user) redirect("/auth/sign-in");

  return <Sidebar>{children}</Sidebar>;
}
