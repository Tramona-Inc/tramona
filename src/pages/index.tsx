import DashboardLayout from '@/components/_common/Layout/DashboardLayout';
import MainLayout from "@/components/_common/Layout/MainLayout";
import TravelerPage from "@/components/landing-page/TravelerPage";

export default function Home() {
  return (
    <DashboardLayout type={'guest'}>
      <TravelerPage />
    </DashboardLayout>
  );
}
