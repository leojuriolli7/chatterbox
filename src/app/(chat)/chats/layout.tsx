import getChats from "@/app/_actions/getChats";
import ChatsList from "@/components/ui/chat/chats-list/chats-list";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getChats();

  return (
    <div className="h-full">
      <ChatsList initialChats={chats} />
      {children}
    </div>
  );
}
