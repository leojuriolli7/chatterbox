import { requiredString } from "@/utils/required-string";
import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const signUpSchema = z
  .object({
    name: requiredString.min(3, "Minimum of 3").max(30, "Maximum of 30"),
    email: requiredString.email(),
    password: z.string().trim().min(8, "Minimum of 8 characters"),
    confirmPassword: z.string().trim().min(8, "Minimum of 8 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  })
  .superRefine(({ password }, ctx) => {
    const isStrongPassword = PASSWORD_REGEX.test(password);

    if (!isStrongPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password too weak",
        path: ["password"],
      });
    }
  });

export type SignUpInput = z.TypeOf<typeof signUpSchema>;

export const signInSchema = z.object({
  email: requiredString.email(),
  password: z.string().trim().min(6, "Minimum of 6 characters"),
});

export type SignInInput = z.TypeOf<typeof signInSchema>;
