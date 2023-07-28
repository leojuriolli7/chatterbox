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
    <Link
      onClick={onClick}
      className={cn(
        "group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-neutral-500 hover:text-black hover:bg-gray-100",
        active && "bg-gray-100 text-black fill-black"
      )}
      href={href}
    >
      <span className="sr-only">{label}</span>
      <Icon className="h-6 w-6" />
    </Link>
  );
}
