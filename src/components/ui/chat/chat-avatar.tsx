import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export default function ChatAvatar({
  name,
  image,
  className,
}: {
  name: string | null;
  image: string | null;
  className?: string;
}) {
  return (
    <div className="relative">
      <Avatar className={className}>
        <AvatarImage src={image || undefined} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 left-0 w-2 h-2 md:h-3 md:w-3" />
    </div>
  );
}
