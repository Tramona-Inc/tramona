import Spinner from "@/components/_common/Spinner";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostPotentialBookingOverview from "../../host/overview/potential-booking-overview/HostPotentialBookingOverview";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import AttentionOverviewSection from "@/components/host/attention-required/AttentionOverviewSection";
import HostStaysOverview from "@/components/host/overview/HostStaysOverview";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";

export default function HostOverview() {
  useSetInitialHostTeamId();
  const { currentHostTeamId } = useHostTeamStore();
  const { data: session } = useSession({
    required: true,
  });
  const { data: user } = api.users.getUser.useQuery();

  return session ? (
    <div className="mx-auto mt-8 min-h-screen-minus-header max-w-8xl space-y-20 p-4 pb-32">
      <h1 className="text-3xl font-semibold md:text-5xl">
        Welcome back, {user?.firstName ? user.firstName : "Host"}!{" "}
      </h1>
      <AttentionOverviewSection currentHostTeamId={currentHostTeamId} />

      <HostStaysOverview currentHostTeamId={currentHostTeamId} />
      <HostPotentialBookingOverview
        currentHostTeamId={currentHostTeamId}
        className="flex-col lg:flex lg:flex-1"
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostPropertiesOverview currentHostTeamId={currentHostTeamId} />
      </div>
    </div>
  ) : (
    <Spinner />
  );
}

// add more spacking on bottom of reservations
