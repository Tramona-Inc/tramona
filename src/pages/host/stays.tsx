import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostStays from "@/components/host/HostStays";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";

export default function Page() {
  useSetInitialHostTeamId();
  return (
    <HostDashboardLayout>
      <div className="mx-auto mt-4 max-w-8xl px-4 md:my-14">
        <HostStays />
      </div>
    </HostDashboardLayout>
  );
}
