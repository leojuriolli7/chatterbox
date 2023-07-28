import Image from "next/image";
import Logo from "@/public/images/logo.webp";
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
    <div className="min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100 dark:bg-neutral-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height={48}
          width={48}
          className="mx-auto w-auto"
          placeholder="blur"
          src={Logo}
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-neutral-300">
          Enter with your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
