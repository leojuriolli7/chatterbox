import { MessagesSquare, LogOut, Users, type LucideIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export type Route = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
};

export default function useGetRoutes() {
  const pathname = usePathname();

  const routes: Route[] = useMemo(
    () => [
      {
        label: "Chat",
        href: "/chats",
        icon: MessagesSquare,
        active: pathname?.includes("/chats"),
      },
      {
        label: "Users",
        href: "/users",
        active: pathname === "/users",
        icon: Users,
      },
      { label: "Logout", href: "#", onClick: () => signOut(), icon: LogOut },
    ],
    [pathname]
  );

  return routes;
}
