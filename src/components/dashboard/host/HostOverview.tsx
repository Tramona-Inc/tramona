import HostAnalytics from "./HostAnalytics";
import HostFinancesOverview from "./HostFinancesOverview";
import HostMessagesOverview from "./HostMesagesOverview";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostRequestsOverview from "./HostRequestsOverview";

export default function HostOverview() {
  return (
    <div className="min-h-screen-minus-header space-y-4 p-4 pb-32">
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostAnalytics className="contents lg:flex lg:flex-1" />
        <HostRequestsOverview className="contents lg:flex lg:flex-1" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostMessagesOverview className="contents flex-1 lg:flex" />
        <HostFinancesOverview className="contents flex-1 lg:flex" />
        <HostPropertiesOverview className="contents flex-1 lg:flex" />
      </div>
    </div>
  );
}
