import { isImage, isVideo } from "@/lib/files";
import { cn } from "@/lib/utils";
import { mediaModalAtom } from "@/store/media-modal";
import type { File } from "@prisma/client";
import { useSetAtom } from "jotai";
import { Play } from "lucide-react";
import Image from "next/image";
import { memo, useCallback } from "react";

const singleMediaClass = "rounded-md aspect-square object-cover";
const mediumMediaClass = "object-cover rounded-md w-32 h-32";

const VideoWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <div className="absolute bg-neutral-800/70 w-9 h-9 rounded-full flex justify-center items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Play className="ml-1 text-white" />
    </div>
    {children}
  </div>
);

function MediaMessage({ files }: { files: File[] }) {
  const numberOfFiles = files.length;
  const setMedia = useSetAtom(mediaModalAtom);

  const onClickMedia = useCallback(
    (file: File) => () => {
      setMedia({
        url: file.url,
        type: file.type,
      });
    },
    [setMedia]
  );

  return (
    <div
      className={cn(
        (numberOfFiles === 2 || numberOfFiles === 3) &&
          "flex gap-2 items-center flex-wrap",
        numberOfFiles === 4 && "grid grid-cols-2 grid-rows-2 gap-2"
      )}
    >
      {files.map((file) => {
        const isSingleMedia = numberOfFiles === 1;

        const mediaClassName = cn(
          "cursor-pointer hover:opacity-90 shadow-sm",
          isSingleMedia ? singleMediaClass : mediumMediaClass
        );

        const dimensions = isSingleMedia ? 256 : 128;

        if (isImage(file)) {
          return (
            <Image
              key={file.id}
              src={file.url}
              alt="User uploaded image"
              width={dimensions}
              height={dimensions}
              className={mediaClassName}
              onClick={onClickMedia(file)}
            />
          );
        }

        if (isVideo(file)) {
          return (
            <VideoWrapper key={file.id}>
              <video
                preload="auto"
                src={file.url}
                width={dimensions}
                height={dimensions}
                className={mediaClassName}
                onClick={onClickMedia(file)}
              />
            </VideoWrapper>
          );
        }
      })}
    </div>
  );
}

export default memo(MediaMessage);
