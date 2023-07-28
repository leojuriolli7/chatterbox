"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function GithubButton(props: Props) {
  return (
    <Button {...props} type="button" className={cn(props.className, "w-full")}>
      <div className="w-full flex items-center justify-center gap-2">
        <GitHubLogoIcon />
        Github
      </div>
    </Button>
  );
}
