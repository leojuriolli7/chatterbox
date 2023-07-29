import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { EditProfileInput } from "@/schemas/profile.schema";
import type { ChangeEvent } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export const UploadAvatar = () => {
  const { watch, setValue } = useFormContext<EditProfileInput>();

  const avatar = watch("avatar");
  const { toast } = useToast();

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    const selectedImage = files?.[0];

    if (!selectedImage) return;
    if (files.length > 1)
      return toast({
        title: "Please select only 1 image",
        variant: "destructive",
      });

    const sizeInKB = selectedImage.size / 1024;
    // 10MB
    const MAX_SIZE = 10240;
    if (sizeInKB > MAX_SIZE)
      return toast({
        title: "Maximum imagesize is 10MB",
        variant: "destructive",
      });

    setValue("avatar", URL.createObjectURL(selectedImage));
  };

  return (
    <Label className="mx-auto text-center cursor-pointer pb-6 hover:opacity-80 transition-opacity">
      <input
        type="file"
        multiple={false}
        accept="image/*"
        className="hidden"
        onChange={onFileSelect}
        name="avatar"
      />

      <div
        className={cn(
          "w-32 h-32 rounded-full dark:bg-neutral-900 relative",
          !avatar &&
            "border-dashed border-2 dark:border-neutral-700 border-neutral-200"
        )}
      >
        {avatar ? (
          <>
            <Image
              unoptimized
              src={avatar}
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-full transition-opacity"
              alt="Your avatar"
            />
            <button
              title="Add a new picture"
              type="button"
              className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full flex justify-center items-center shadow-md cursor-pointer transition pointer-events-none"
            >
              <span className="sr-only">Add a new profile picture</span>
              <Plus className="w-5 h-5 text-white" />
            </button>
          </>
        ) : (
          <>
            <Plus className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />

            <Button
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 px-0 pointer-events-none"
              variant="brand"
              size="sm"
              type="button"
            >
              Select an image
            </Button>
          </>
        )}
      </div>
    </Label>
  );
};
