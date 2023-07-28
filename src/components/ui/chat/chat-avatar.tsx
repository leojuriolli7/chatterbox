import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export default function ChatAvatar({
  name,
  image,
}: {
  name: string | null;
  image: string | null;
}) {
  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={image || undefined} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 left-0 w-2 h-2 md:h-3 md:w-3" />
    </div>
  );
}
