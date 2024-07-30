import { useSession } from "next-auth/react";
import Head from "next/head";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import ProfilePage from "@/components/profile/ProfilePage";

export default function Page() {
  useSession({ required: true });

  return (
    <DashboardLayout type={"guest"}>
      <Head>
        <title>Profile | Tramona</title>
      </Head>
      <ProfilePage />
      {/* <ReferralDashboard /> */}

      {/* <div className="flex min-h-screen-minus-header">
        <ProfileSidebar />
        <div className="flex-1 overflow-clip">
          <Tabs
            defaultValue="referralDashboard"
            className="mx-auto max-w-2xl space-y-4 px-4 py-8"
          >
            <TabsList>
              <TabsTrigger value="referralDashboard">
                <Share2Icon /> Referral Dashboard
              </TabsTrigger>
              <TabsTrigger value="profile">
                <Edit2Icon /> Edit Profile
              </TabsTrigger>
              commented out
              <TabsTrigger value="editPassword">
                <SecurityIcon /> Change password
              </TabsTrigger>
            </TabsList>
            <TabsContent value="referralDashboard">
              <ReferralDashboard />
            </TabsContent>
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
            commented out
            <TabsContent value="editPassword">
              <PasswordResetForm />
            </TabsContent>
          </Tabs>
        </div>
      </div> */}
    </DashboardLayout>
  );
}
