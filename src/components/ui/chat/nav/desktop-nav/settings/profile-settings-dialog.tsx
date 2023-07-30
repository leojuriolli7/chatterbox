"use client";

import {
  Dialog,
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
  editProfileSchema,
  type EditProfileInput,
} from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { UploadAvatar } from "./avatar-upload";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/upload-thing";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { useAtom } from "jotai";
import { profileModalAtom } from "@/store/profile-settings-modal";

type Props = { user: User };

export default function ProfileSettingsDialog({ user }: Props) {
  const [settingsModalOpen, setSettingsModalOpen] = useAtom(profileModalAtom);

  const methods = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name as string,
      avatar: user?.image,
    },
  });
  const { handleSubmit, control } = methods;
  const { startUpload: startImageUpload } = useUploadThing("imageUploader");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (values: EditProfileInput) => {
    const { name, avatar } = values;
    let uploadedAvatarUrl: string | null = avatar;
    setLoading(true);

    const hasNewAvatar = user.image !== avatar;

    if (!!avatar && hasNewAvatar === true) {
      const avatarBlob = await fetch(avatar).then((r) => r.blob());
      const avatarFile = new File([avatarBlob], `${name}-${v4()}.png`, {
        type: "image/png",
      });

      if (avatarFile)
        await startImageUpload([avatarFile])
          .then((res) => {
            if (res?.[0]) {
              uploadedAvatarUrl = res[0].fileUrl;
            }
          })
          .catch((e) =>
            toast({
              title: "Error uploading your avatar",
              variant: "destructive",
              description: JSON.stringify(e),
            })
          );
    }

    fetch(`/api/profile`, {
      method: "POST",
      body: JSON.stringify({
        avatar: uploadedAvatarUrl,
        name,
      }),
    })
      .then((res) => {
        if (res.ok) {
          router.refresh();
          setSettingsModalOpen(false);
          methods.reset();
        }

        if (!res.ok) {
          toast({
            title: "Error updating your profile.",
            description: res.statusText,
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
    <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
      <DialogContent>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
              <div className="border-neutral-900/20 pb-12">
                <h2 className="leading-7 text-2xl text-neutral-900 dark:text-neutral-200 font-semibold">
                  Update your profile
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  Make your profile <span className="font-bold">yours.</span>
                </p>

                <div className="mt-10 flex flex-col gap-8">
                  <UploadAvatar />

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
                            type="text"
                            placeholder="Write a username..."
                            // fool browsers to stop autocompleting.
                            autoComplete="nope"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
