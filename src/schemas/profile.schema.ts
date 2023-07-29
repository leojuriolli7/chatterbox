import { requiredString } from "@/lib/required-string";
import { z } from "zod";

export const editProfileSchema = z.object({
  name: requiredString,
  avatar: z.string().nullable(),
});

export type EditProfileInput = z.TypeOf<typeof editProfileSchema>;
