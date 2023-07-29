import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { ChatterboxFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<ChatterboxFileRouter>();
