import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="flex w-full items-center justify-center">
        <div className="mt-10 max-w-7xl">
          {" "}
          <h1 className="w-full text-start text-3xl font-semibold">Report</h1>
          <div className="mt-5 flex flex-col gap-y-3">
            <Button variant="ghost">
              <Link href="/host/report/security-deposit">Report Damages </Link>{" "}
            </Button>
            <Button variant="ghost">
              {" "}
              <Link href="/host/report/resolution-form">
                Believe damages are over your security deposit? File with our
                insurance
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
