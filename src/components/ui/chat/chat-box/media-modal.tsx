"use client";

import { useAtom } from "jotai";
import { mediaModalAtom } from "@/store/media-modal";
import { Dialog, DialogOverlay } from "@/components/ui/dialog";
import useGetActiveChat from "@/hooks/useGetActiveChat";
import Image from "next/image";
import {
  DialogPortal as DialogPrimitivePortal,
  DialogContent as DialogPrimitiveContent,
  DialogClose as DialogPrimitiveClose,
} from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function ChatMediaModal() {
  const [media, setMedia] = useAtom(mediaModalAtom);
  const isMediaModalOpen = !!media;

  const { chatId } = useGetActiveChat();

  const onMediaModalOpenChange = (value: boolean) => {
    if (value === false) {
      setMedia(null);
    }
  };

  useEffect(() => {
    setMedia(null);
  }, [chatId, setMedia]);

  return (
    <Dialog open={isMediaModalOpen} onOpenChange={onMediaModalOpenChange}>
      <DialogPrimitivePortal>
        <DialogOverlay />
        <DialogPrimitiveContent className="fixed bg-white dark:bg-neutral-700 min-w-[150px] min-h-[150px] rounded-md left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] gap-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <DialogPrimitiveClose className="data-[state=open]:animate-in data-[state=closed]:hidden absolute right-4 top-4 z-10">
            <X className="text-white drop-shadow-2xl w-6 h-6" />
          </DialogPrimitiveClose>

          <div className="max-w-[min(90vw,1000px)] sm:max-h-[min(90vh, 1000px)] max-h-[min(90dvh,1000px)] relative">
            {media?.type === "image" && (
              <Image
                src={media.url}
                alt="User upload"
                width="0"
                height="0"
                sizes="100vw"
                className="max-w-[min(90vw,1000px)] sm:max-h-[min(90vh, 1000px)] max-h-[min(90dvh,1000px)] w-auto h-auto"
              />
            )}
            {media?.type === "video" && (
              <video
                src={media.url}
                preload="auto"
                controls
                autoPlay
                muted
                width="auto"
                height="auto"
                className="max-w-[min(90vw,1000px)] max-h-[min(90vh,1000px)] w-auto h-auto"
              />
            )}
          </div>
        </DialogPrimitiveContent>
      </DialogPrimitivePortal>
    </Dialog>
  );
}
