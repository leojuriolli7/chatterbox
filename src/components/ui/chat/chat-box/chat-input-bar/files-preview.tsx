"use client";

import { useFormContext } from "react-hook-form";
import type { CreateMessageInput } from "@/schemas/chat.schema";
import type { FileWithPath } from "./upload-button";
import Image from "next/image";
import { X as CloseIcon } from "lucide-react";

export default function FilesPreview() {
  const { watch, setValue } = useFormContext<CreateMessageInput>();
  const files = watch("files") as FileWithPath[];

  const onClickDeleteImage = (id?: string) => () => {
    setValue(
      "files",
      files.filter((file) => file.id !== id)
    );
  };

  return files?.length ? (
    <div className="absolute bottom-[70px] left-0 w-full py-4 flex justify-center gap-3 items-center bg-white dark:bg-neutral-800 border-t dark:border-b dark:border-neutral-700">
      {files.map((file) => (
        <div key={file.id} className="relative shrink-0">
          <button
            className="absolute -top-2 -right-2 bg-white dark:bg-neutral-900 dark:border-neutral-700 border rounded-full w-8 h-8 flex justify-center items-center"
            type="button"
            onClick={onClickDeleteImage(file.id)}
          >
            <span className="sr-only">Remove this image</span>
            <CloseIcon className="w-5 h-5" />
          </button>
          <Image
            unoptimized
            src={file.localFilePath as string}
            alt="Uploaded image"
            width={80}
            height={80}
            className="rounded-md object-cover min-w-[80px] aspect-square shadow-md"
          />
        </div>
      ))}
    </div>
  ) : null;
}
