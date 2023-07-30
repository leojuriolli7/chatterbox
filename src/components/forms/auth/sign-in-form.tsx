"use client";

import { type SignInInput, signInSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GithubButton from "@/components/ui/github-button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import AuthFeedbackMessage from "@/components/ui/auth-feedback-message";

type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default";

// default next-auth error messages mapped for each error type.
const errors: Record<SignInErrorTypes, string> = {
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "The e-mail could not be sent.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
  default: "Unable to sign in.",
};

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const errorType = params?.error as SignInErrorTypes;
  const error = errorType && (errors[errorType] ?? errors.default);

  const methods = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const { control, handleSubmit } = methods;

  const onSubmit = (values: SignInInput) => {
    setLoading(true);
    signIn("credentials", {
      ...values,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast({
            variant: "destructive",
            title: "Could not sign you in.",
            description: callback?.error || "Something went wrong.",
          });
        }

        if (callback?.ok && !callback?.error) {
          router.push("/");
        }
      })
      .finally(() => setLoading(false));
  };

  const signInWithGithub = () => {
    setLoading(true);
    signIn("github", {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast({
            title: "Could not sign up with Github.",
            description: callback?.error || "Internal error ocurred.",
          });
        }

        if (callback?.ok) {
          console.log("SUCCESS");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...methods}>
      <AuthFeedbackMessage message={error} />
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Write your email..."
                  type="email"
                  disabled={loading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Write your password..."
                  type="password"
                  disabled={loading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          variant="brand"
          loading={loading}
        >
          Sign in to Chatterbox
        </Button>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 items-center flex">
              <div className="w-full border-t border-neutral-400" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
                Or continue with
              </span>
            </div>
          </div>

          <GithubButton
            onClick={signInWithGithub}
            loading={loading}
            className="mt-4"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            New to Chatterbox?{" "}
            <Link href="/auth/sign-up" className="underline text-blue-500">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
