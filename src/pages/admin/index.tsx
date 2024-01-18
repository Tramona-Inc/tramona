import DisplayRequests from "@/components/Admin/DisplayRequests";
import FormRequest from "@/components/FormRequest";
import MainLayout from "@/components/layouts/MainLayout";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";

export default function Page() {
  const { data } = useSession();

  // Only admin can access this page
  useEffect(() => {
    if (data?.user.role !== "admin") {
      void router.push("/");
    }
  }, [data, router]);

  if (!data || data?.user.role !== "admin") {
    return null;
  }

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
