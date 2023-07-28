import type { ChatWithMessagesAndUsers } from "@/types";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

// Get the opposite user to the logged in user.
export default function useGetOtherUser(
  chat: ChatWithMessagesAndUsers | { users: User[] }
) {
  const { data: session } = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.user?.email;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return chat.users.find((user) => user.email !== currentUserEmail)!;
  }, [session?.user?.email, chat]);

  return otherUser;
}
