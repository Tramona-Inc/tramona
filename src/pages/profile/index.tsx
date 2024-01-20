import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { Share2Icon, Edit2Icon } from "lucide-react";
import SecurityIcon from "@/components/icons/SecurityIcon";

import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import ReferralDashboard from "@/components/Profile/ReferralDashboard";
import ProfileForm from "@/components/Profile/ProfileForm";
import PasswordResetForm from "@/components/Profile/PasswordResetForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    else {
      if (!session) {
        void router.push("/");
      }
    }

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [session, status]);

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
            <TabsContent value="editPassword">
              <PasswordResetForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
