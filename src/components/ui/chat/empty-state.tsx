import Image from "next/image";
import TalkingImage from "@/public/images/talking.webp";

export default function EmptyState() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 flex justify-center h-full bg-neutral-100 dark:border-l dark:border-neutral-800 dark:bg-neutral-900">
      <div className="text-center item-center flex flex-col">
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
