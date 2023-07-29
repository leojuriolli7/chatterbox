import { createNextRouteHandler } from "uploadthing/next";
import { chatterBoxFileRouter } from "./core";

export const { GET, POST } = createNextRouteHandler({
  router: chatterBoxFileRouter,
});
