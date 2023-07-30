import { requiredString } from "@/lib/required-string";
import { z } from "zod";

export const getOrCreateDMSchema = z.object({
  userId: requiredString,
});

export type GetOrCreateDMInput = z.TypeOf<typeof getOrCreateDMSchema>;

export const clientCreateGroupSchema = z.object({
  members: z
    .object({
      id: z.string(),
      name: z.string(),
      image: z.string().nullable(),
    })
    .array()
    .min(2, "Must select atleast 2 members"),
  name: requiredString,
});

export type ClientCreateGroupInput = z.TypeOf<typeof clientCreateGroupSchema>;

export const serverCreateGroupSchema = z.object({
  members: z.string().array().min(2),
  name: requiredString,
});

export type ServerCreateGroupInput = z.TypeOf<typeof serverCreateGroupSchema>;

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
