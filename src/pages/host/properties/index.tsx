import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostPropertiesLayout from "@/components/dashboard/host/HostPropertiesLayout";
import HostPropertyInfo from "@/components/dashboard/host/HostPropertyInfo";
import { type Property } from "@/server/db/schema/tables/properties";
import Head from "next/head";
import { useState } from "react";

export default function Page() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const handleHostPropertiesData = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <DashboardLayout type="host">
      <Head>
        <title>Properties | Tramona</title>
      </Head>
      <HostPropertiesLayout onSendData={handleHostPropertiesData}>
        <div className="mx-auto my-10 min-h-screen-minus-header-n-footer max-w-4xl rounded-2xl border">
          <HostPropertyInfo property={selectedProperty} />
        </div>
      </HostPropertiesLayout>
    </DashboardLayout>
  );
}
