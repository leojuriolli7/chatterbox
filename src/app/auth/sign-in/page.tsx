import SignInForm from "@/components/forms/auth/sign-in-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in to Chatterbox",
};

export default function SignInPage() {
  return <SignInForm />;
}
