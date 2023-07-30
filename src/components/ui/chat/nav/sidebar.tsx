import getCurrentUser from "@/app/_actions/getCurrentUser";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export default async function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full relative max-w-[1920px] mx-auto">
      <DesktopNav currentUser={currentUser} />
      <MobileNav />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}
