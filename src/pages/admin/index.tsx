import DisplayRequests from "@/components/Admin/DisplayRequests";
import FormRequest from "@/components/FormRequest";
import MainLayout from "@/components/layouts/MainLayout";
import { requireRole } from "@/server/auth";

export const getServerSideProps = requireRole(["admin"]);

export default function Page() {
  return (
    <MainLayout pageTitle="Admin Dashboard">
      <main className="container flex flex-col space-y-5">
        <h1 className="text-bold text-4xl uppercase">admin dashboard</h1>
        <div>
          <FormRequest />
        </div>
        <DisplayRequests />
      </main>
    </MainLayout>
  );
}
