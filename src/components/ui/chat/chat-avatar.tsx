import { useAtomValue } from "jotai";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { activeUsersAtom } from "@/store/active-users";

type Props = {
  id: string;
  name: string | null;
  email?: string | null;
  image: string | null;
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
  const isActive = email ? members.indexOf(email) !== -1 : false;

  const canRenderActiveStatus = alwaysOnline === true || isActive;

  return (
    <div className="relative h-[inherit]">
      <Avatar className={className}>
        <AvatarImage src={image || undefined} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>

      {canRenderActiveStatus && (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 left-0 w-2 h-2 md:h-3 md:w-3" />
      )}
    </div>
  );
}
