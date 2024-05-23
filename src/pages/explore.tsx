import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import SearchPage from "@/components/landing-page/search/SearchPage";
function Page() {
  return (
    <div>
      <DashboardLayout type={"guest"}>
        <SearchPage />
      </DashboardLayout>
    </div>
  );
}

export default Page;
