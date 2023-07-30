"use client";

import useGetActiveChat from "@/hooks/useGetActiveChat";
import useGetRoutes from "@/hooks/useGetRoutes";
import Item from "./item";
import SettingsItem from "./settings-item";

export default function MobileFooter() {
  const routes = useGetRoutes();
  const { isOpen } = useGetActiveChat();

  if (isOpen) return null;

  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
      {routes.map((route) => (
        <Item {...route} key={route.label} />
      ))}

      <SettingsItem />
    </div>
  );
}
