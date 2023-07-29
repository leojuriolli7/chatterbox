"use client";

import useGetRoutes from "@/hooks/useGetRoutes";
import Item from "./item";
import type { User } from "@prisma/client";
import ThemeSwitch from "@/components/ui/theme-switch";
import ChatAvatar from "../../chat-avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProfileSettingsDialog from "./settings/profile-settings-dialog";
import { useState } from "react";

type Props = {
  currentUser: User | null;
};

export default function DesktopSidebar({ currentUser }: Props) {
  const routes = useGetRoutes();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <div className="hidden lg:absolute lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-x lg:pb-4 lg:flex lg:flex-col justify-between lg:dark:bg-neutral-900 lg:dark:border-neutral-800">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-3">
          {routes.map((item) => (
            <Item {...item} key={item.label} />
          ))}
        </ul>
      </nav>

      {currentUser && (
        <nav className="mt-4 flex flex-col justify-between items-center gap-3">
          <ThemeSwitch />
          <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="cursor-pointer hover:opacity-75 transition"
              >
                <ChatAvatar
                  name={currentUser.name}
                  image={currentUser?.image}
                />
              </button>
            </DialogTrigger>

            <ProfileSettingsDialog
              {...currentUser}
              onOpenChange={setSettingsModalOpen}
            />
          </Dialog>
        </nav>
      )}
    </div>
  );
}
