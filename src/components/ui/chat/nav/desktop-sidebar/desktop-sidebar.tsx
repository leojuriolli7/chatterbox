"use client";

import useGetRoutes from "@/hooks/useGetRoutes";
import Item from "./item";
import type { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

type Props = {
  currentUser: User | null;
};

export default function DesktopSidebar({ currentUser }: Props) {
  const routes = useGetRoutes();
  const [_settingsModalOpen, setSettingsModalOpen] = useState(false);

  const toggleSettingsModal = (value: boolean) => () =>
    setSettingsModalOpen(value);

  return (
    <aside className="hidden lg:absolute lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-x lg:pb-4 lg:flex lg:flex-col justify-between">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((item) => (
            <Item {...item} key={item.label} />
          ))}
        </ul>
      </nav>

      {currentUser && (
        <nav className="mt-4 flex flex-col justify-between items-center">
          <button
            type="button"
            onClick={toggleSettingsModal(true)}
            className="cursor-pointer hover:opacity-75 transition relative"
          >
            <Avatar>
              <AvatarImage src={currentUser?.image || undefined} />
              <AvatarFallback>{currentUser.name}</AvatarFallback>
            </Avatar>

            <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 left-0 w-2 h-2 md:h-3 md:w-3" />
          </button>
        </nav>
      )}
    </aside>
  );
}
