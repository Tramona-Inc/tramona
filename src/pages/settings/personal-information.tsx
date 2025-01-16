import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import PersonalInformation from "@/components/settings/PersonalInformation";
import React from "react";

function Page() {
  return (
    <SettingsLayout>
      <PersonalInformation />
    </SettingsLayout>
  );
}

export default Page;
