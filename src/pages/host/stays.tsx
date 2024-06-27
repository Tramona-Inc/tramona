import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostStays from "@/components/host/HostStays";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <div className="mx-auto mt-16 max-w-6xl">
        <HostStays />
      </div>
    </DashboardLayout>
  );
}
