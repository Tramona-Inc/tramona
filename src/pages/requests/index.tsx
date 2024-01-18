import MainLayout from "@/components/layouts/MainLayout";
import { requireAuth } from "@/server/auth";

export const getServerSideProps = requireAuth;

export default function Page() {
  return (
    <MainLayout pageTitle="Your Requests">
      <p className="p-8">your requests</p>
    </MainLayout>
  );
}
