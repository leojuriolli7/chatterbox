import { useParams } from "next/navigation";

export default function useGetActiveChat() {
  const params = useParams();

  const getChatId = () => {
    if (!params?.chatId) return "";

    return params.chatId as string;
  };

  const chatId = getChatId();
  const isOpen = !!chatId;

  return { isOpen, chatId };
}
