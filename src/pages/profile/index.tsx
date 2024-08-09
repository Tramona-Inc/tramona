import { useSession } from "next-auth/react";
import Head from "next/head";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import ProfilePage from "@/components/profile/ProfilePage";

export default function Page() {
  useSession({ required: true });

  return (
    <DashboardLayout>
      <Head>
        <title>Profile | Tramona</title>
      </Head>
      <ProfilePage />
    </DashboardLayout>
  );
}
