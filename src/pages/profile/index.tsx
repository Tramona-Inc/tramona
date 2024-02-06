import { useSession } from "next-auth/react";
import Head from "next/head";

import ProfileForm from "@/components/profile/ProfileForm";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ReferralDashboard from "@/components/profile/ReferralDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2Icon, Share2Icon } from "lucide-react";

export default function Page() {
  useSession({ required: true });

  return (
    <>
      <Head>
        <title>Profile | Tramona</title>
      </Head>

      <div className="flex min-h-[calc(100vh-4.5rem)]">
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
              {/* <TabsTrigger value="editPassword">
                <SecurityIcon /> Change password
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="referralDashboard">
              <ReferralDashboard />
            </TabsContent>
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
            {/* <TabsContent value="editPassword">
              <PasswordResetForm />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </>
  );
}
