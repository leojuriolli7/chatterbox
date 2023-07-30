"use client";

import {
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type ClientCreateGroupInput,
  type ServerCreateGroupInput,
  clientCreateGroupSchema,
} from "@/schemas/chat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User, Chat } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AddMembers } from "./add-members";

type Props = {
  onOpenChange(open: boolean): void;
  users: User[];
};

export default function CreateGroupDialogContent({
  onOpenChange,
  users,
}: Props) {
  const methods = useForm<ClientCreateGroupInput>({
    resolver: zodResolver(clientCreateGroupSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });
  const { handleSubmit, control } = methods;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const selectableUsers = useMemo(
    () =>
      users.map((u) => ({
        name: u.name || "",
        id: u.id,
        image: u.image,
      })),
    [users]
  );

  const onSubmit = (values: ClientCreateGroupInput) => {
    setLoading(true);

    const serverPayload: ServerCreateGroupInput = {
      ...values,
      members: values.members.map((member) => member.id),
    };

    fetch(`/api/chat`, { method: "POST", body: JSON.stringify(serverPayload) })
      .then(async (res) => {
        if (res.ok) {
          router.refresh();
          onOpenChange(false);
          methods.reset();

          const createdChat = (await res.json()) as Chat;
          router.push(`/chats/${createdChat.id}`);
        }
        if (!res.ok) {
          toast({
            title: "Error creating your new chat",
            description: res.statusText,
            variant: "destructive",
          });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <DialogContent>
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-neutral-900/20 pb-12">
              <h2 className="leading-7 text-2xl text-neutral-900 dark:text-neutral-200 font-semibold">
                Create new group chat
              </h2>

              <p className="mt-1 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                Collaborate, discuss, and share. Customize your group chat by
                adding a title and inviting members.
              </p>

              <div className="mt-10 flex flex-col gap-8">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group name</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="dark:bg-transparent"
                          placeholder="Write a cool name..."
                          // fool browsers to stop autocompleting.
                          autoComplete="nope"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <AddMembers users={selectableUsers} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="ghost" type="button" disabled={loading}>
                Cancel
              </Button>
            </DialogTrigger>
            <Button variant="brand" loading={loading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
