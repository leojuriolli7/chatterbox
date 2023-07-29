import type { File } from "@prisma/client";
import { Play } from "lucide-react";
import Image from "next/image";

const singleMediaClass = "rounded-md max-w-[256px]";
const mediumMediaClass = "object-cover rounded-md w-32 h-32";

const VideoWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <div className="absolute bg-neutral-800/70 w-9 h-9 rounded-full flex justify-center items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Play className="ml-1" />
    </div>
    {children}
  </div>
);

export default function MediaMessage({ files }: { files: File[] }) {
  const numberOfFiles = files.length;

  const isImage = (file: File) => file.type === "image";
  const isVideo = (file: File) => file.type === "video";

  if (numberOfFiles === 1 && isImage(files[0]))
    return (
      <Image
        src={files[0].url}
        alt="User uploaded image"
        width={256}
        height={256}
        className={singleMediaClass}
      />
    );

  if (numberOfFiles === 1 && isVideo(files[0]))
    return (
      <VideoWrapper>
        <video
          src={files[0].url}
          width={256}
          height={256}
          className={singleMediaClass}
        />
      </VideoWrapper>
    );

  if (numberOfFiles === 2 || numberOfFiles === 3) {
    return (
      <div className="flex gap-2 items-center flex-wrap">
        {files.map((file) => {
          if (isImage(file)) {
            return (
              <Image
                src={file.url}
                key={file.id}
                alt="User uploaded image"
                width={128}
                height={128}
                className={mediumMediaClass}
              />
            );
          }

          if (isVideo(file)) {
            return (
              <VideoWrapper key={file.id}>
                <video
                  src={files[0].url}
                  width={128}
                  height={128}
                  className={mediumMediaClass}
                />
              </VideoWrapper>
            );
          }

          return null;
        })}
      </div>
    );
  }

  if (numberOfFiles === 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        {files.map((file) => {
          if (isImage(file)) {
            return (
              <Image
                src={file.url}
                alt="User uploaded image"
                width={128}
                height={128}
                key={file.id}
                className={mediumMediaClass}
              />
            );
          }

          if (isVideo(file)) {
            return (
              <VideoWrapper key={file.id}>
                <video
                  src={files[0].url}
                  width={128}
                  height={128}
                  className={mediumMediaClass}
                />
              </VideoWrapper>
            );
          }

          return null;
        })}
      </div>
    );
  }

  return null;
}
