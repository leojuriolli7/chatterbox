"use client";

import { useFormContext } from "react-hook-form";
import type { CreateMessageInput } from "@/schemas/chat.schema";
import Image from "next/image";
import { X as CloseIcon } from "lucide-react";
import { isImage, isVideo } from "@/lib/files";

export default function FilesPreview({ loading }: { loading: boolean }) {
  const { watch, setValue } = useFormContext<CreateMessageInput>();
  const files = watch("files");

  const onClickDeleteFile = (id?: string) => () => {
    if (!!files?.length) {
      setValue(
        "files",
        files.filter((file) => file.url !== id)
      );
    }
  };

  return files?.length ? (
    <div className="absolute bottom-[70px] left-0 w-full py-4 flex justify-center gap-3 items-center bg-white dark:bg-neutral-800 border-t dark:border-b dark:border-neutral-700">
      {files.map((file) => (
        <div key={file.url} className="relative shrink-0">
          {!loading && (
            <button
              className="absolute -top-2 -right-2 bg-white dark:bg-neutral-900 dark:border-neutral-700 border rounded-full w-8 h-8 flex justify-center items-center z-20 hover:scale-110 transition"
              type="button"
              onClick={onClickDeleteFile(file.url)}
            >
              <span className="sr-only">Remove this image</span>
              <CloseIcon className="w-5 h-5" />
            </button>
          )}
          {isImage(file) && (
            <Image
              unoptimized
              src={file.url}
              alt="Uploaded image"
              width={80}
              height={80}
              className="rounded-md object-cover min-w-[80px] aspect-square shadow-md"
            />
          )}

          {isVideo(file) && (
            <video
              src={file.url}
              preload="auto"
              muted
              width={80}
              height={80}
              className="rounded-md object-cover min-w-[80px] aspect-square shadow-md"
            />
          )}
        </div>
      ))}
    </div>
  ) : null;
}
