import getCurrentUser from "@/app/_actions/getCurrentUser";
import DesktopSidebar from "./desktop-sidebar/desktop-sidebar";
import MobileFooter from "./mobile-footer/mobile-footer";

export default async function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full relative">
      <DesktopSidebar currentUser={currentUser} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}
