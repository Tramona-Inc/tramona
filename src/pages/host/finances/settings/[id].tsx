import React, { useMemo } from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import BackButton from "@/components/_common/BackButton";
import {
  ConnectAccountOnboarding,
  ConnectNotificationBanner,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import ErrorAlert from "../_components/ErrorAlert";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const router = useRouter();
  const connectId = useMemo(() => router.query.id as string, [router.query.id]);
  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = api.users.getUserByStripeConnectId.useQuery(
    { connectId },
    { enabled: Boolean(router.isReady) },
  );

  if (isError && error instanceof Error) {
    return (
      <DashboardLayout>
        <ErrorAlert error={error} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <BackButton href="/host/finances" />
        <h1 className="mx-auto mb-4 text-center text-3xl font-bold">
          Finance Settings
        </h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-6 w-6" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Manage your payment settings and account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || !isStripeConnectInstanceReady ? (
              <LoadingCard />
            ) : user?.stripeConnectId && user.chargesEnabled ? (
              <div className="space-y-4">
                <ConnectNotificationBanner />
                <ConnectAccountManagement
                  collectionOptions={{
                    fields: "eventually_due",
                    futureRequirements: "include",
                  }}
                />
              </div>
            ) : (
              <div className="text-center">
                <ConnectAccountOnboarding
                  onExit={() => window.location.reload()}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

const LoadingCard = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-6 w-48" />
      </CardTitle>
      <Skeleton className="mt-1 h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-4">
      {[
        "Professional details",
        "Public details",
        "Personal details",
        "Payout details",
        "Linked external accounts",
        "Authentication",
      ].map((index) => (
        <div key={index} className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-40" />
        </div>
      ))}
    </CardContent>
  </Card>
);
