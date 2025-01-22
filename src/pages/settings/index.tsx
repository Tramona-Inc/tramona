import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import React from "react";
import PersonalInformation from "@/components/settings/PersonalInformation";
import { useIsXs } from "@/utils/utils";

// const settingsLinks = [
//   { title: "Personal informtation", href: "/personal-information" },
//   { title: "Payment information", href: "/payment-information" },
//   { title: "Notifications", href: "/notifications" },
// ];

function Page() {
  const isXs = useIsXs();
  return (
    <SettingsLayout isBasePath={true}>
      {!isXs && <PersonalInformation />}
    </SettingsLayout>
  );
}

export default Page;
