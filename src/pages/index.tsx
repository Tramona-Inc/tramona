import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import SearchPage from "@/components/landing-page/search/SearchPage";
import TravelerPage from "@/components/landing-page/TravelerPage";

export default function Home() {
  return (
    <DashboardLayout type={"guest"}>
      <TravelerPage />
    </DashboardLayout>
  );
}
