/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import getServerSideSession from "@/app/_actions/getServerSideSession";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const authMiddleware = async () => {
  const session = await getServerSideSession();

  if (!session?.user?.email) throw new Error("Unauthorized");
  return {
    userEmail: session?.user?.email,
  };
};

export const chatterBoxFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 4 } })
    .middleware(authMiddleware)
    .onUploadComplete(({ file }) => {
      console.log("file url", file.url);
    }),
  videoUploader: f({ video: { maxFileSize: "16MB", maxFileCount: 4 } })
    .middleware(authMiddleware)
    .onUploadComplete(({ file }) => {
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type ChatterboxFileRouter = typeof chatterBoxFileRouter;
