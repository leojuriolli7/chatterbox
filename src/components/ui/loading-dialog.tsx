"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay } from "./dialog";
import { Loader2 } from "lucide-react";

export default function LoadingDialog() {
  return (
    <Dialog open>
      <DialogPrimitive.Portal>
        <DialogOverlay className="backdrop-blur-md" />

        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <Loader2 className="animate-spin w-10 h-10 text-black dark:text-white focus:ring-0 focus-visible:ring-0" />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
