import MainLayout from "@/components/layouts/MainLayout";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error");

  return (
    <MainLayout>
      <p className="p-8">error: {errorMsg}</p>
    </MainLayout>
  );
}
