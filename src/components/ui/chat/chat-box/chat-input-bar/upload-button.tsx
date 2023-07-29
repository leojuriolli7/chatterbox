"use client";

import { useToast } from "@/hooks/useToast";
import type { CreateMessageInput } from "@/schemas/chat.schema";
import { ImagePlus } from "lucide-react";
import type { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export interface FileWithPath extends File {
  localFilePath?: string;
  id?: string;
}

export default function UploadButton() {
  const { toast } = useToast();
  const { setValue, watch } = useFormContext<CreateMessageInput>();
  const filesValue = watch("files") as File[];

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const numberOfFilesSelected = files?.length;

    if (!numberOfFilesSelected) return;

    if (
      numberOfFilesSelected > 4 ||
      numberOfFilesSelected + filesValue?.length > 4
    ) {
      return toast({
        title: "Maximum of 4 files per message.",
        variant: "destructive",
      });
    }

    const filesArray = Array.from(files);
    const fileTooBig = filesArray.some((file) => {
      const sizeInKB = file.size / 1024;

      // 10MB
      const MAX_SIZE = 10240;
      return sizeInKB > MAX_SIZE;
    });

    if (fileTooBig) return toast({ title: "Maximum size per file is 10MB" });

    const arrayToSend = filesArray.map((file: FileWithPath) => {
      file = new File([file], file.name, { type: file.type });
      file.localFilePath = URL.createObjectURL(file);
      file.id = uuidv4();

      return file;
    });

    return setValue("files", [...(filesValue || []), ...arrayToSend]);
  };

  return (
    <label className="cursor-pointer">
      <input
        onChange={onFileChange}
        name="files"
        className="hidden"
        type="file"
        max={4}
        accept="video/*, image/*"
        multiple
      />
      <ImagePlus className="h-7 w-7 text-blue-500" />
    </label>
  );
}
