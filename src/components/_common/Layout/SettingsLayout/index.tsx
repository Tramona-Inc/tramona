import SettingsSidebar from "@/components/settings/SettingsSidebar";
import DashboardLayout from "../DashboardLayout";
import Head from "next/head";
import { useIsSm } from "@/utils/utils";

type SettingsLayoutProps = {
  children?: React.ReactNode;
  isBasePath?: boolean;
};

export default function SettingsLayout({
  children,
  isBasePath = false,
}: SettingsLayoutProps) {
  const isSmallScreen = useIsSm();
  return (
    <DashboardLayout>
      <Head>
        <title>Settings | Tramona</title>
      </Head>

      <div className="flex min-h-screen-minus-header">
        {(isSmallScreen || isBasePath) && <SettingsSidebar />}
        <div className="min-h-screen-minus-header flex-1">{children}</div>
      </div>
    </DashboardLayout>
  );
}
