import HostAnalytics from "./HostAnalytics";
import HostFinancesOverview from "./HostFinancesOverview";
import HostMessagesOverview from "./HostMesagesOverview";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostRequestsOverview from "./HostRequestsOverview";
import HostStaysOverview from "./HostStaysOverview";

export default function HostOverview() {
  return (
    <div className="mx-auto min-h-screen-minus-header-n-footer max-w-7xl space-y-4 px-3 py-4 pb-32 sm:py-8">
      <h1 className="text-2xl font-bold sm:text-4xl">At a glance</h1>
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* <HostAnalytics className="contents lg:flex lg:flex-1" /> */}
        <HostStaysOverview className="contents flex-1 overflow-x-auto lg:flex" />
        <HostRequestsOverview className="contents flex-1 lg:flex" />
        <HostPropertiesOverview className="contents basis-1/4 lg:flex" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostFinancesOverview className="contents flex-1 lg:flex" />
        <HostFinancesOverview className="contents basis-1/4 lg:flex" />
        <HostMessagesOverview className="contents h-96 basis-1/4 lg:flex" />
      </div>
    </div>
  );
}
