import { useAtomValue } from "jotai";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { activeUsersAtom } from "@/store/active-users";
import type { User } from "@prisma/client";

type Props = User & {
  className?: string;
  alwaysOnline?: boolean;
};

export default function ChatAvatar({
  className,
  email,
  name,
  image,
  alwaysOnline,
}: Props) {
  const members = useAtomValue(activeUsersAtom);
  const isActive = members.indexOf(email as string) !== -1;

  return (
    <div className="relative">
      <Avatar className={className}>
        <AvatarImage src={image || undefined} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      {isActive ||
        (alwaysOnline && (
          <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 left-0 w-2 h-2 md:h-3 md:w-3" />
        ))}
    </div>
  );
}
