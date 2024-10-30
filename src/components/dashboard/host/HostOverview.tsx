import Spinner from "@/components/_common/Spinner";
import HostAnalytics from "./HostAnalytics";
import HostFinancesOverview from "./HostFinancesOverview";
import HostMessagesOverview from "./HostMesagesOverview";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostRequestsOverview from "./HostRequestsOverview";
import HostReportOverview from "./HostReportOverview";
import { useSession } from "next-auth/react";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import { api } from "@/utils/api";

export default function HostOverview() {
  const { data: session } = useSession({
    required: true,
  });
  const { data: user } = api.users.getUser.useQuery();

  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();

  return session ? (
    <div className="min-h-screen-minus-header space-y-4 p-4 pb-32">
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostAnalytics
          className="contents lg:flex lg:flex-1"
          stripeConnectIdNumber={user?.stripeConnectId}
        />
        <HostRequestsOverview className="contents lg:flex lg:flex-1" />
        <HostMessagesOverview className="contents flex-1 lg:flex" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostPropertiesOverview className="contents flex-1 lg:flex" />
        <HostFinancesOverview
          isStripeConnectInstanceReady={isStripeConnectInstanceReady}
          stripeConnectIdNumber={user?.stripeConnectId}
          className="contents flex-1 lg:flex"
        />
        <HostReportOverview />
      </div>
    </div>
  ) : (
    <Spinner />
  );
}
