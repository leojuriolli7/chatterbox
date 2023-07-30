import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsIcon() {
  const pathname = usePathname();
  const active = pathname?.includes("settings");

  return (
    <Link
      href="/settings"
      className={cn(
        "group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-neutral-500 hover:text-black hover:bg-gray-100 dark:hover:text-white dark:hover:bg-neutral-700/60 -order-1",
        active &&
          "bg-gray-100 text-black fill-black dark:bg-neutral-700/60 dark:fill-white dark:text-white"
      )}
    >
      <span className="sr-only">Manage your settings</span>
      <Settings className="h-6 w-6" />
    </Link>
  );
}
