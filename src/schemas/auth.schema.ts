import { requiredString } from "@/lib/required-string";
import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const signUpSchema = z
  .object({
    name: requiredString.min(3, "Minimum of 3").max(30, "Maximum of 30"),
    email: requiredString.email(),
    password: z
      .string()
      .trim()
      .min(8, "Minimum of 8 characters")
      .refine(
        (value) => {
          const isStrongPassword = PASSWORD_REGEX.test(value);

          return isStrongPassword;
        },
        { message: "Password too weak" }
      ),
    confirmPassword: z.string().trim().min(8, "Minimum of 8 characters"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.TypeOf<typeof signUpSchema>;

export const signInSchema = z.object({
  email: requiredString.email(),
  password: z.string().trim().min(6, "Minimum of 6 characters"),
});

export type SignInInput = z.TypeOf<typeof signInSchema>;

export const pusherAuthSchema = z.object({
  socket_id: z.string(),
  channel_name: z.string(),
});
