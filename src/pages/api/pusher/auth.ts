import { authOptions } from "@/lib/auth-options";
import { pusherServer } from "@/lib/pusher";
import { pusherAuthSchema } from "@/schemas/auth.schema";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) return res.status(401);

  const bodyParsing = pusherAuthSchema.safeParse(req.body);

  if (!bodyParsing.success) return res.status(400);

  const socketId = bodyParsing.data.socket_id;
  const channel = bodyParsing.data.channel_name;

  // when a user becomes active, pusher will send their email
  // as `id`
  const data = {
    user_id: session.user.email,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  return res.send(authResponse);
}
