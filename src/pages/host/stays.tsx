import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostStays from "@/components/host/HostStays";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <div className="mx-auto mt-4 max-w-6xl px-4 md:mt-16">
        <HostStays />
      </div>
    </DashboardLayout>
  );
}
