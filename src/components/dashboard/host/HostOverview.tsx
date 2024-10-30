import Spinner from "@/components/_common/Spinner";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostPotentialBookingOverview from "./HostPotentialBookingOverview";
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
    <div className="mx-auto mt-8 min-h-screen-minus-header max-w-8xl space-y-5 p-4 pb-32">
      <h1 className="pb-5 text-3xl font-bold md:text-5xl">
        Welcome back, {user?.firstName ? user.firstName : "Host"}!{" "}
      </h1>
      <AttentionOverviewSection />
      <div className="flex flex-col gap-y-4">
        <HostStaysOverview />
        <HostPotentialBookingOverview className="contents lg:flex lg:flex-1" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <HostPropertiesOverview />
      </div>
    </div>
  ) : (
    <Spinner />
  );
}
