import React from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ProfileViewLoadingState } from "../../../components/dashboard/host/profile/ProfileViewLoadingState";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfileVericationCard from "@/components/dashboard/host/profile/ProfileVericationCard";
import { fieldConfig } from "@/components/dashboard/host/profile/fieldConfig";
import { ViewProfileField } from "@/components/dashboard/host/profile/ViewProfileField";
import ListingsCarousel from "@/components/profile/ListingsCarousel";
import { AnonymousAvatar } from "@/components/ui/avatar";
function Page() {
  const router = useRouter();
  const { data: session } = useSession();

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
  console.log(userWProfile);
  return (
    <DashboardLayout>
      {" "}
      {userWProfile ? (
        <div className="mx-auto my-10 max-w-8xl space-y-6 p-4">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Profile Card */}
            <div className="space-y-4">
              <Card className="">
                <CardContent className="p-6">
                  <div className="relative">
                    {userWProfile.user.image ? (
                      <div className="relative h-28 w-28 overflow-hidden rounded-full">
                        <Image
                          src={userWProfile.user.image}
                          alt={userWProfile.user.firstName ?? "users image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <AnonymousAvatar className="size-20" />
                    )}
                  </div>
                  <div>
                    <h2 className="mt-2 flex items-center text-2xl font-semibold">
                      {userWProfile.user.firstName}{" "}
                      <span className="relative ml-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </span>
                    </h2>
                    <p className="text-sm text-muted-foreground">Host</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="font-semibold">1</p>
                      <p className="text-sm text-muted-foreground">Review</p>
                    </div>
                    <div>
                      <p className="font-semibold">2</p>
                      <p className="text-sm text-muted-foreground">
                        Months hosting
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <ProfileVericationCard userWProfile={userWProfile} />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">
                  About {userWProfile.user.firstName}
                </h1>

                {session?.user && userWProfile.user.id === session.user.id && (
                  <Link href="/profile/edit">
                    <Button variant="outline" size="sm">
                      Edit profile
                    </Button>
                  </Link>
                )}
              </div>
              {userWProfile.aboutYou && (
                <Card>
                  <CardTitle>About </CardTitle>
                  <CardContent>{userWProfile.aboutYou}</CardContent>
                </Card>
              )}
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(fieldConfig).map(([field, config]) => {
                  const value =
                    userWProfile[field as keyof typeof userWProfile];

                  if (value === null) {
                    return null;
                  }

                  return (
                    <div
                      key={field}
                      className={
                        field === "location"
                          ? "flex items-center justify-between rounded-lg p-4 hover:bg-muted/50"
                          : undefined
                      }
                    >
                      <ViewProfileField
                        icon={config.icon}
                        label={config.label}
                        value={String(value)}
                      />
                    </div>
                  );
                })}
              </div>{" "}
              <ListingsCarousel userWProfile={userWProfile} />
            </div>
          </div>
        </div>
      ) : (
        <ProfileViewLoadingState />
      )}
    </DashboardLayout>
  );
}

export default Page;
