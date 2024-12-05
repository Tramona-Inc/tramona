import HostPropertiesCancellation from "./HostPropertiesCancellation";
import { type Property } from "@/server/db/schema";

import React from "react";
import HostSecurityDepositSection from "./HostSecurityDepositSection";

function HostPolicySection({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-y-4">
      <HostPropertiesCancellation property={property} />
      <HostSecurityDepositSection property={property} />
    </div>
  );
}

export default HostPolicySection;
