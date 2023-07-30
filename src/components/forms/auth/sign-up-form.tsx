"use client";

import { type SignUpInput, signUpSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GithubButton from "@/components/ui/github-button";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { signIn } from "next-auth/react";

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const methods = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const { control, handleSubmit } = methods;

  const onSubmit = (values: SignUpInput) => {
    setLoading(true);
    fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
    })
      // to-do: better error handling here
      .then((res) => {
        if (res.ok) {
          void signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/",
          });

          if (!res.ok) {
            toast({
              title: "Something went wrong.",
              variant: "destructive",
              description: res.statusText,
            });
          }
        }
      })
      .catch(() => {
        toast({
          title: "Something went wrong.",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  };

  const signUpWithGithub = () => {
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form {...methods}>
      <form
        autoComplete="false"
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Write a username..."
                  // fool browsers to stop autocompleting.
                  autoComplete="nope"
                  disabled={loading}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
                  placeholder="Write an email..."
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
                  placeholder="Write a password..."
                  // fool browsers to stop autocompleting.
                  autoComplete="new-password"
                  type="password"
                  disabled={loading}
                />
              </FormControl>

              <FormDescription>
                Minimum of 8 characters, 1 special character and 1 capital
                letter
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  {...field}
                  placeholder="Confirm your password..."
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
          Sign up to Chatterbox
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
            onClick={signUpWithGithub}
            className="mt-4"
            loading={loading}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline text-blue-500">
              Click here to login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
