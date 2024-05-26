import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TravelerPage from "@/components/landing-page/TravelerPage";

export default function Home() {
  return (
    <DashboardLayout type={"guest"}>
      <TravelerPage />
    </DashboardLayout>
  );
}
