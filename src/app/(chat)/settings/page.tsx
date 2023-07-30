"use client";

import { Button } from "@/components/ui/button";
import SelectTheme from "@/components/ui/theme-select";
import { profileModalAtom } from "@/store/profile-settings-modal";
import { useSetAtom } from "jotai";

export default function SettingsPage() {
  const setShowProfileSettings = useSetAtom(profileModalAtom);

  const onClickSettings = () => {
    setShowProfileSettings(true);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-400">
        Settings
      </h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl text-neutral-700 mt-4 dark:text-neutral-400">
            Theme and appearance
          </h2>
          <p className="text-sm text-neutral-500 mb-4">Set the right mood</p>
          <SelectTheme />
        </div>

        <div>
          <h2 className="text-xl text-neutral-700 mt-4 dark:text-neutral-400">
            Your profile
          </h2>
          <p className="text-sm text-neutral-500 mb-4">
            Customize your account
          </p>

          <Button onClick={onClickSettings} className="w-full" variant="brand">
            Open profile settings
          </Button>
        </div>
      </div>
    </div>
  );
}
