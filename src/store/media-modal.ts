import { atom } from "jotai";

type MediaModalState = {
  url: string;
  type: "image" | "video";
} | null;

export const mediaModalAtom = atom<MediaModalState>(null);
