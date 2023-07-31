import type { User } from "@prisma/client";
import UserPreview from "./user-preview";

type Props = {
  users: User[];
};

export default function UsersList({ users }: Props) {
  return (
    <aside className="absolute bg-white dark:bg-neutral-925 inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-neutral-200 dark:border-neutral-800 block w-full left-0">
      <div className="px-5">
        <div className="flex-col py-4 sticky top-0 bg-white dark:bg-neutral-925 z-10">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-400">
            Users
          </h2>
        </div>

        <div className="space-y-2">
          {users?.map((user) => (
            <UserPreview key={user.id} {...user} />
          ))}
        </div>
      </div>
    </aside>
  );
}
