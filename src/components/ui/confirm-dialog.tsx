"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";

type Props = {
  openState: [boolean, React.Dispatch<boolean>];
  title: string;
  description?: string;
  confirmButtonMessage: string;
  onClickDelete: () => void;
  loading: boolean;
};

export const ConfirmDialog = ({
  title,
  openState,
  description = "This action is permanent and cannot be undone.",
  confirmButtonMessage,
  onClickDelete,
  loading,
}: Props) => {
  const [open, setOpen] = openState;

  const toggleOpen = (value: boolean) => () => {
    setOpen(value);
  };
  return (
    <Dialog open={open} onOpenChange={toggleOpen(!open)}>
      <DialogContent hideCloseButton>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex sm:flex-row flex-col gap-2 justify-end">
            <Button
              className="w-full sm:w-auto"
              disabled={loading}
              type="button"
              onClick={toggleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              loading={loading}
              variant="destructive"
              onClick={onClickDelete}
            >
              {confirmButtonMessage}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
