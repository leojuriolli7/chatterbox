import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_ID as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET as string,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    channelAuthorization: {
      endpoint: "/api/pusher/auth",
      transport: "ajax",
    },
  }
);
