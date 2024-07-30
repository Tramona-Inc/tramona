import Spinner from "@/components/_common/Spinner";
import HostAnalytics from "./HostAnalytics";
import HostFinancesOverview from "./HostFinancesOverview";
import HostMessagesOverview from "./HostMesagesOverview";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostRequestsOverview from "./HostRequestsOverview";
import { useSession } from "next-auth/react";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import { api } from "@/utils/api";

export default function HostOverview() {
  const { data: session } = useSession({
    required: true,
  });
  const userRole = session?.user.role.toString();

  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();

  const { data: stripeAccountIdNumber } = api.host.getStripeAccountId.useQuery(
    undefined,
    {
      enabled:
        isStripeConnectInstanceReady && userRole == "host" ? true : false,
    },
  );
  // const { data: hostInfo } = api.host.getUserHostInfo.useQuery();

  return session ? (
    <div className="min-h-screen-minus-header space-y-4 p-4 pb-32">
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostAnalytics
          className="contents lg:flex lg:flex-1"
          isStripeConnectInstanceReady={isStripeConnectInstanceReady}
          stripeAccountIdNumber={stripeAccountIdNumber?.stripeAccountId}
        />
        <HostRequestsOverview className="contents lg:flex lg:flex-1" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostMessagesOverview className="contents flex-1 lg:flex" />
        <HostFinancesOverview
          isStripeConnectInstanceReady={isStripeConnectInstanceReady}
          stripeAccountIdNumber={stripeAccountIdNumber?.stripeAccountId}
          className="contents flex-1 lg:flex"
        />
        <HostPropertiesOverview className="contents flex-1 lg:flex" />
      </div>
    </div>
  ) : (
    <Spinner />
  );
}
