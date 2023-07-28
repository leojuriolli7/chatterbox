import getUsers from "../../_actions/getUsers";
import UsersList from "@/components/ui/chat/users-list/users-list";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <>
      <UsersList users={users} />
      <div className="h-full">{children}</div>
    </>
  );
}
