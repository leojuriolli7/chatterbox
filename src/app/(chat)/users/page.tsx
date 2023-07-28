import EmptyState from "@/components/ui/chat/empty-state";

export default function Home() {
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
}
