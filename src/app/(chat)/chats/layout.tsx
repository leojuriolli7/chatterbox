import getChats from "@/app/_actions/getChats";
import getUsers from "@/app/_actions/getUsers";
import ChatsList from "@/components/ui/chat/chats-list/chats-list";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chats, users] = await Promise.all([getChats(), getUsers()]);

  return (
    <div className="h-full">
      <ChatsList initialChats={chats} users={users} />
      {children}
    </div>
  );
}
