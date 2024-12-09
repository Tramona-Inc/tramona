import Spinner from "@/components/_common/Spinner";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostPotentialBookingOverview from "../../host/overview/potential-booking-overview/HostPotentialBookingOverview";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import AttentionOverviewSection from "@/components/host/attention-required/AttentionOverviewSection";
import HostStaysOverview from "@/components/host/overview/HostStaysOverview";
export default function HostOverview() {
  const { data: session } = useSession({
    required: true,
  });
  const { data: user } = api.users.getUser.useQuery();

  return session ? (
    <div className="min-h-screen-minus-header mx-auto mt-8 max-w-8xl space-y-20 p-4 pb-32">
      <h1 className="text-3xl font-semibold md:text-5xl">
        Welcome back, {user?.firstName ? user.firstName : "Host"}!{" "}
      </h1>
      <AttentionOverviewSection />

      <HostStaysOverview />
      <HostPotentialBookingOverview className="flex-col lg:flex lg:flex-1" />
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostPropertiesOverview />
      </div>
    </div>
  ) : (
    <Spinner />
  );
}

// add more spacking on bottom of reservations
