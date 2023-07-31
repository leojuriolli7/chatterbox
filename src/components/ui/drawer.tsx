import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Drawer = Dialog.Root;

const DrawerTrigger = Dialog.Trigger;

const DrawerPortal = ({ className, ...props }: Dialog.DialogPortalProps) => (
  <Dialog.Portal className={cn(className)} {...props} />
);
DrawerPortal.displayName = Dialog.Portal.displayName;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-neutral-950/80",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = Dialog.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed right-0 top-0 sm:h-screen h-[100dvh] z-50 overflow-y-auto w-full max-w-lg border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  data-[state=closed]:slide-out-to-right-1/2  data-[state=open]:slide-in-from-right-1/2 md:w-full dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
      {...props}
    >
      {children}
      <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-800 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400">
        <X className="md:h-4 md:w-4 w-6 h-6" />
        <span className="sr-only">Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </DrawerPortal>
));
DrawerContent.displayName = Dialog.Content.displayName;

export { Drawer, DrawerTrigger, DrawerContent };
