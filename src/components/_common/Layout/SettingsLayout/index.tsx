import SettingsSidebar from "@/components/settings/SettingsSidebar";
import DashboardLayout from "../DashboardLayout";
import Head from "next/head";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <DashboardLayout>
      <Head>
        <title>Settings | Tramona</title>
      </Head>

      <div className="flex min-h-screen-minus-header">
        <SettingsSidebar />
        <div className="min-h-screen-minus-header flex-1 bg-zinc-100">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
}
