"use client";

import { useToast } from "@/hooks/useToast";
import { useUploadThing } from "@/lib/upload-thing";
import { cn } from "@/lib/utils";
import type { CreateMessageInput, FileToUpload } from "@/schemas/chat.schema";
import { ImagePlus, Loader2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  loadingState: [boolean, React.Dispatch<boolean>];
};

export default function UploadButton({ loadingState }: Props) {
  const [loading, setLoading] = loadingState;

  const { toast } = useToast();
  const { setValue, watch } = useFormContext<CreateMessageInput>();

  const { startUpload: startImagesUpload } = useUploadThing("imageUploader");
  const { startUpload: startVideosUpload } = useUploadThing("videoUploader");

  const filesValue = watch("files");

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const numberOfFilesSelected = files?.length;

    if (!numberOfFilesSelected) return;

    const tooManyFiles =
      !!filesValue && numberOfFilesSelected + filesValue?.length > 4;

    if (numberOfFilesSelected > 4 || tooManyFiles) {
      return toast({
        title: "Maximum of 4 files per message.",
        variant: "destructive",
      });
    }

    const filesArray = Array.from(files);

    const invalidType = filesArray.some(
      (file) => !file?.type.includes("image") && !file?.type.includes("video")
    );

    if (invalidType) {
      return toast({ title: "Only videos or images are allowed" });
    }

    const fileTooBig = filesArray.some((file) => {
      const sizeInKB = file.size / 1024;

      // 10MB
      const MAX_SIZE = 10240;
      return sizeInKB > MAX_SIZE;
    });

    if (fileTooBig) return toast({ title: "Maximum size per file is 10MB" });

    // if files array is valid, we start uploading.
    setLoading(true);

    const videos = filesArray?.filter((f) => f?.type?.includes("video"));
    const images = filesArray?.filter((f) => f?.type?.includes("image"));

    let filesToUpload: FileToUpload[] = [];

    let videosPromise;
    let imagesPromise;

    if (!!videos?.length) videosPromise = startVideosUpload(videos);
    if (!!images?.length) imagesPromise = startImagesUpload(images);

    const [uploadedVideos, uploadedImages] = await Promise.all([
      videosPromise,
      imagesPromise,
    ]);

    if (!!uploadedVideos?.length) {
      const formattedVideos: FileToUpload[] = uploadedVideos?.map((v) => ({
        url: v.fileUrl,
        type: "video",
      }));

      filesToUpload = [...formattedVideos];
    }

    if (!!uploadedImages?.length) {
      const formattedImages: FileToUpload[] = uploadedImages?.map((i) => ({
        url: i.fileUrl,
        type: "image",
      }));

      filesToUpload = [...filesToUpload, ...formattedImages];
    }

    setLoading(false);

    setValue("files", [...(filesValue || []), ...filesToUpload]);
  };

  return (
    <label className="cursor-pointer hover:scale-110 transition">
      <input
        onChange={onFileChange}
        name="files"
        className="hidden"
        type="file"
        max={4}
        accept="video/*, image/*"
        multiple
        disabled={loading}
      />
      {loading ? (
        <Loader2 className="w-7 h-7 animate-spin opacity-50 text-blue-500" />
      ) : (
        <ImagePlus className={cn("h-7 w-7 text-blue-500")} />
      )}
    </label>
  );
}
