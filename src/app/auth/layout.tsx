import { redirect } from "next/navigation";
import getServerSideSession from "../_actions/getServerSideSession";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSideSession();

  // route will only be accessible to unauthenticated users.
  if (!!session?.user) redirect("/");

  return (
    <div className="min-h-screen flex">
      <div className="relative hidden sm:block w-[50vw] lg:w-[max(400px,25vw)] h-auto bg-[url('/images/auth-bg.jpg')] bg-top bg-no-repeat">
        <h1 className="text-4xl font-bold mt-2 ml-2 text-white absolute lg:-right-[67px] tracking-wide right-2 top-2 site-title-colors">
          Chatterbox
        </h1>
      </div>

      <div className="mt-8 lg:ml-24 px-6 sm:w-[50vw] w-full flex items-center">
        <div className="w-full sm:max-w-[400px] pb-4">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-300">
            Enter with your account
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}
