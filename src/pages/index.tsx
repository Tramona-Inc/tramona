import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import SearchPage from "@/components/landing-page/search/SearchPage";

export default function Home() {
  return (
    <DashboardLayout type={"guest"}>
      <SearchPage />
    </DashboardLayout>
  );
}
