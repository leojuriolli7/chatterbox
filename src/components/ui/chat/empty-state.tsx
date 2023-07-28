import Image from "next/image";
import TalkingImage from "@/public/images/talking.webp";

export default function EmptyState() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 flex justify-center h-full bg-white border-r border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 select-none">
      <div className="text-center item-center flex flex-col mt-16">
        <Image
          src={TalkingImage}
          width={600}
          height={450}
          placeholder="blur"
          alt="People talking"
        />
        <h3 className="text-2xl font-semibold mt-2 text-neutral-800 dark:text-neutral-400/90">
          Continue a conversation or start a brand new one!
        </h3>

        <p className="mt-2 text-blue-500">
          Start a DM, or join group with your friends
        </p>
      </div>
    </div>
  );
}
