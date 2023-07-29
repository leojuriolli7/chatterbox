"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay } from "./dialog";
import { Loader2 } from "lucide-react";

export default function LoadingDialog() {
  return (
    <Dialog open>
      <DialogPrimitive.Portal>
        <DialogOverlay className="backdrop-blur-md" />

        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50">
          <Loader2 className="animate-spin w-10 h-10 text-black dark:text-white" />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
