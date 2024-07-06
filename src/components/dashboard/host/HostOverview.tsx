import HostAnalytics from "./HostAnalytics";
import HostFinancesOverview from "./HostFinancesOverview";
import HostMessagesOverview from "./HostMesagesOverview";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostRequestsOverview from "./HostRequestsOverview";

export default function HostOverview() {
  return (
    <div className="mx-auto min-h-screen-minus-header-n-footer max-w-7xl space-y-4 py-8 pb-32">
      <h1 className="text-4xl font-bold">At a glance</h1>
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostAnalytics className="contents lg:flex lg:flex-1" />
        <HostRequestsOverview className="contents lg:flex lg:flex-1" />
        <HostPropertiesOverview className="contents flex-1 lg:flex" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostFinancesOverview className="contents flex-1 lg:flex" />
        <HostFinancesOverview className="contents flex-1 lg:flex" />
        <HostMessagesOverview className="contents flex-1 lg:flex" />
      </div>
    </div>
  );
}
