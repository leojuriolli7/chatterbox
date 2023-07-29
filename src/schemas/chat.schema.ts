import { requiredString } from "@/lib/required-string";
import { z } from "zod";

export const getOrCreateDMSchema = z.object({
  userId: requiredString,
});

export type GetOrCreateDMInput = z.TypeOf<typeof getOrCreateDMSchema>;

export const createGroupSchema = z.object({
  members: z.string().array().min(2),
  name: requiredString,
});

export type CreateGroupInput = z.TypeOf<typeof createGroupSchema>;

export const createMessageSchema = z.object({
  message: z.string().optional(),
  files: z
    .object({
      type: z.enum(["image", "video"]),
      url: z.string(),
    })
    .array()
    .nullable(),
  chatId: requiredString,
});

export type CreateMessageInput = z.TypeOf<typeof createMessageSchema>;

export type FileToUpload = {
  type: "image" | "video";
  url: string;
};
