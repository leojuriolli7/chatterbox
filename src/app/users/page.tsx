import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EmptyState from "@/components/ui/chat/empty-state";
import getServerSideSession from "../_actions/getServerSideSession";

export default async function Home() {
  const session = await getServerSideSession();

  // route will only be accessible to authenticated users.
  if (!session?.user) redirect("/auth/sign-in");

  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
}
