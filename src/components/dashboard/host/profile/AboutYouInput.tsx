import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import type { MyUserWProfile } from "./AllFieldDialogs";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";

function AboutYouInput({
  myUserWProfile,
}: {
  myUserWProfile: MyUserWProfile | undefined;
}) {
  const { mutateAsync: updateIntro } =
    api.users.updateProfileIntro.useMutation();

  const [value, setValue] = useState<string | null | undefined>(
    myUserWProfile?.aboutYou,
  );

  useEffect(() => {
    setValue(myUserWProfile?.aboutYou);
  }, [myUserWProfile]);

  const handleUpdateField = (field: string, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">About you</h2>
      <Textarea
        placeholder="Write something fun and punchy."
        className="min-h-[100px] w-full"
        value={value ?? ""}
        onChange={(e) => handleUpdateField("aboutYou", e.target.value)}
      />
      <Button
        variant="outline"
        className="mt-2"
        onClick={async () => {
          await updateIntro(value ?? "");
        }}
      >
        Add intro
      </Button>
    </div>
  );
}

export default AboutYouInput;
