import Sidebar from "@/components/ui/chat/nav/sidebar";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
