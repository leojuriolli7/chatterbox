import type { Route } from "@/hooks/useGetRoutes";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Item({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: Route) {
  return (
    <li onClick={onClick}>
      <Link
        className={cn(
          "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-neutral-500 hover:text-black hover:bg-neutral-100 dark:hover:text-white dark:hover:bg-neutral-600 transition-colors",
          active &&
            "bg-neutral-100 text-black fill-black dark:bg-neutral-600 dark:fill-white dark:text-white"
        )}
        href={href}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
}
