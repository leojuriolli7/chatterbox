import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function useGetActiveChat() {
  const params = useParams();

  const chatId = useMemo(() => {
    if (!params?.id) return "";

    return params.id as string;
  }, [params]);

  const isOpen = !!chatId;

  return { isOpen, chatId };
}
