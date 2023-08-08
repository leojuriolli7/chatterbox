"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useGetActiveChat from "@/hooks/useGetActiveChat";
import {
  type CreateMessageInput,
  createMessageSchema,
} from "@/schemas/chat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import UploadButton from "./upload-button";
import FilesPreview from "./files-preview";
import { useToast } from "@/hooks/useToast";

export default function ChatInputBar() {
  const loadingState = useState(false);
  const [loading, setLoading] = loadingState;

  const { toast } = useToast();
  const { chatId } = useGetActiveChat();

  const methods = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      message: "",
      files: [],
      chatId,
    },
  });

  const { watch } = methods;
  const message = watch("message");
  const files = watch("files");

  const onSubmit = (values: CreateMessageInput) => {
    if (!values.files?.length && !values.message) return;
    if (loading) return;

    setLoading(true);

    fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        message: values.message,
        chatId: values.chatId,
        files: values.files,
      }),
    })
      .then((res) => {
        if (res.ok) {
          methods.resetField("files");
          methods.resetField("message");
          methods.reset();
        }
        if (!res.ok) {
          toast({
            title: "Something went wrong.",
            description: res.statusText,
          });
        }
      })
      .finally(() => setLoading(false))
      .catch((e) => console.log(e));
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="py-4 px-4 bg-white dark:bg-neutral-800 border-t flex items-center gap-2 lg:gap-4 w-full dark:border-none relative h-[70px]">
          <FilesPreview loading={loading} />
          <UploadButton loadingState={loadingState} />
          <div className="flex items-center gap-2 lg:gap-4 w-full">
            <FormField
              control={methods.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Write a message..."
                      type="text"
                      className="py-2 px-4 rounded-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            size="icon"
            variant="ghost"
            loading={loading}
            className="h-9 w-9 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 transition rounded-full shrink-0"
            loaderClasses="text-white"
            disabled={!message && !files?.length}
          >
            <SendHorizonal className="text-white h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
