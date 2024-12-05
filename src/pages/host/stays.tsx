import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostStays from "@/components/host/HostStays";

export default function Page() {
  return (
    <HostDashboardLayout>
      <div className="mx-auto mt-4 max-w-8xl px-4 md:my-14">
        <HostStays />
      </div>
    </HostDashboardLayout>
  );
}
