import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

type Size = "small" | "medium";

type Props = {
  users: User[];
  size?: Size;
};

const positions: Record<Size, Record<number, string>> = {
  small: {
    0: "top-0 left-3",
    1: "bottom-0",
    2: "bottom-0 right-0",
  },
  medium: {
    0: "top-0 left-4",
    1: "-bottom-1 -left-1",
    2: "-bottom-1 -right-1",
  },
};

const dimensions: Record<Size, string> = {
  medium: "h-16 w-16",
  small: "h-11 w-11",
};

export default function GroupAvatar({ users, size = "small" }: Props) {
  const firstThreeUsers = users.slice(0, 3);

  return (
    <div className={cn("relative", dimensions[size])}>
      {firstThreeUsers.map((user, i) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full overflow-hidden h-1/2 w-1/2 ${positions[size][i]}`}
        >
          <Avatar className="w-full h-full">
            <AvatarImage src={user.image as string} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
}
