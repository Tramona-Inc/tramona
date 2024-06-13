import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import SearchPage from "@/components/landing-page/search/SearchPage";

function Page() {
  return (
    <DashboardLayout type={"guest"}>
      <SearchPage />
    </DashboardLayout>
  );
}

export default Page;
