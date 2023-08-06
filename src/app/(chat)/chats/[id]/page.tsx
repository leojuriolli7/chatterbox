import getChatById from "@/app/_actions/getChatById";
import getMessages from "@/app/_actions/getMessages";
import { ChatInputBar, ChatBox, Header } from "@/components/ui/chat/chat-box";

type RouteParams = {
  params: {
    id: string;
  };
};

export default async function SingleChatPage({ params: { id } }: RouteParams) {
  // parallel fetching for faster results.
  const [chat, messages] = await Promise.all([
    getChatById(id),
    getMessages(id),
  ]);

  if (!chat) return null;

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header {...chat} />
        <ChatBox initialMessages={messages} isGroup={chat.isGroup} />
        <ChatInputBar />
      </div>
    </div>
  );
}
