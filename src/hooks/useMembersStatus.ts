import { pusherClient } from "@/lib/pusher";
import { activeUsersAtom } from "@/store/active-users";
import { useSetAtom } from "jotai";
import type { Channel, Members } from "pusher-js";
import { useEffect, useState } from "react";

const useMembersStatus = () => {
  const setActiveUsers = useSetAtom(activeUsersAtom);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    // runs when the user first subscribes, we set the active users at that
    // time.
    channel.bind("pusher:subscription-succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      // `id` is the user's email.
      members.each((member: Record<string, string>) =>
        initialMembers.push(member.id)
      );

      setActiveUsers(initialMembers);
    });

    // update when new user is online
    channel.bind("pusher:member_added", (member: Record<string, string>) => {
      setActiveUsers((prev) => [...prev, member.id]);
    });

    // update when some user leaves
    channel.bind("pusher:member_removed", (member: Record<string, string>) => {
      setActiveUsers((prev) => prev.filter((id) => id !== member.id));
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, setActiveUsers]);
};

export default useMembersStatus;
