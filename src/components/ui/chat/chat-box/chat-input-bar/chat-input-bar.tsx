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

export default function ChatInputBar() {
  const [loading, _setLoading] = useState(false);
  const { chatId } = useGetActiveChat();

  const methods = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      message: "",
      files: [],
      chatId,
    },
  });

  const onSubmit = (values: CreateMessageInput) => {
    if (!values.files?.length && !values.message) return;

    console.log("values:", values);
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="py-4 px-4 bg-white dark:bg-neutral-800 border-t flex items-center gap-2 lg:gap-4 w-full dark:border-none relative h-[70px]">
          <FilesPreview />
          <UploadButton />
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
            className="h-9 w-9 bg-blue-500 hover:bg-blue-600 transition rounded-full"
            loaderClasses="text-white"
          >
            <SendHorizonal className="text-white h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
