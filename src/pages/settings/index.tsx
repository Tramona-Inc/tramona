import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { settingsLinks } from "@/components/settings/settingsLinks";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

export default function Settings() {
  return (
    <DashboardLayout>
      <Head>
        <title>Settings | Tramona</title>
      </Head>

      <div className="min-h-screen-minus-header space-y-4 p-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div>
          {settingsLinks.map(({ href, label }) => (
            <Button
              key={href}
              variant="ghost"
              asChild
              className="w-full justify-between"
            >
              <Link href={href}>
                {label}
                <ChevronRight />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
