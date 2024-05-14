import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import { ChevronRight } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

export default function Settings() {
  return (
    <DashboardLayout type="guest">
      <Head>
        <title>Settings | Tramona</title>
      </Head>

      <div className="min-h-screen-minus-header space-y-4 p-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="grid grid-cols-1 gap-2 divide-y-2">
          <Link
            href="/settings/personal-information"
            className="hover:bg-zinc-100"
          >
            <div className="flex items-center justify-between gap-2 py-2">
              Personal information
              <ChevronRight />
            </div>
          </Link>
          <Link
            href="/settings/payment-information"
            className="hover:bg-zinc-100"
          >
            <div className="flex items-center justify-between gap-2 py-2">
              Payment information
              <ChevronRight />
            </div>
          </Link>
          <Link href="/settings/notifications" className="hover:bg-zinc-100">
            <div className="flex items-center justify-between gap-2 py-2">
              Notifications
              <ChevronRight />
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
