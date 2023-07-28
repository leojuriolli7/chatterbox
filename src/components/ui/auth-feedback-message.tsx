import { cn } from "@/lib/utils";
import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Props = {
  message: string;
  icon?: boolean;
  type?: "error" | "success";
};

const AuthFeedbackMessage = ({
  message,
  icon = true,
  type = "error",
}: Props) => {
  const isError = type === "error";

  return (
    message && (
      <div
        className={cn(
          "flex w-full items-center gap-2 p-3 text-center text-white rounded-lg mb-3",
          isError ? "bg-red-600" : "bg-green-500 dark:bg-green-600"
        )}
      >
        {icon && isError && <AlertCircle size={21} className="text-white" />}

        {icon && !isError && <CheckCircle2 size={21} className="text-white" />}

        <p>{message}</p>
      </div>
    )
  );
};

export default AuthFeedbackMessage;
