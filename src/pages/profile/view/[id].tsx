import React from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

function Page() {
  const router = useRouter();

  // Safely access and convert userId using optional chaining, nullish coalescing operator, and type assertion
  const userId = router.isReady
    ? ((router.query.id as string | undefined) ?? undefined)
    : undefined;

  const { data: userWProfile } = api.users.getUserWithProfile.useQuery(
    userId!,
    {
      enabled: !!userId,
    },
  );

  return (
    <DashboardLayout>
      {" "}
      <div> {userWProfile && userWProfile?.aboutYou} </div>{" "}
    </DashboardLayout>
  );
}

export default Page;
