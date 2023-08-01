"use client";

import {
  useCallback,
  useState,
  useRef,
  type KeyboardEvent,
  useMemo,
} from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useFormContext } from "react-hook-form";
import type { ClientCreateGroupInput } from "@/schemas/chat.schema";
import { Label } from "@/components/ui/label";
import ChatAvatar from "../chat-avatar";

type SelectableUser = {
  name: string;
  id: string;
  image: string | null;
};

export function AddMembers({ users }: { users: SelectableUser[] }) {
  const { watch, setValue, formState, getFieldState } =
    useFormContext<ClientCreateGroupInput>();
  const fieldState = getFieldState("members", formState);
  const { error } = fieldState;

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const selected = watch("members");
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback(
    (user: SelectableUser) => {
      setValue(
        "members",
        selected?.filter((s) => s.id !== user.id)
      );
    },
    [selected, setValue]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...selected];
            newSelected.pop();

            setValue("members", newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected, setValue]
  );

  const selectables = useMemo(
    () =>
      users.filter(
        (user) => !selected.find((selectedUser) => selectedUser.id === user.id)
      ),
    [selected, users]
  );

  return (
    <div className="space-y-2">
      <Label>Select members</Label>

      {!!error && (
        <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">
          {error?.message}
        </p>
      )}
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-sm rounded-md">
          <div className="flex gap-1 flex-wrap">
            {selected.map((user) => {
              return (
                <Badge key={user.id} variant="secondary">
                  {user.name}
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(user);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(user)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder="Select users..."
              className="ml-2 bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 flex-1 md:text-sm text-base w-[100px]"
            />
          </div>
        </div>
        <div className="relative mt-2 bg-transparent">
          {open && (
            <div className="absolute w-full z-10 top-0 rounded-md border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md outline-none animate-in">
              <CommandGroup className="h-full max-h-[200px] overflow-auto">
                {selectables.length ? (
                  selectables.map((user) => {
                    return (
                      <CommandItem
                        key={user.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          setInputValue("");
                          setValue("members", [...selected, user], {
                            shouldValidate: !!error,
                          });
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex gap-2 items-center">
                          <ChatAvatar {...user} />

                          <span>{user.name}</span>
                        </div>
                      </CommandItem>
                    );
                  })
                ) : (
                  <CommandItem disabled>No options</CommandItem>
                )}
              </CommandGroup>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
}
