import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import PastTrips from "@/components/my-trips/PastTrips";
import UpcomingTrips from "@/components/my-trips/UpcomingTrips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, HistoryIcon, ReceiptTextIcon } from "lucide-react";
import { useMemo } from "react";
import { api, type RouterOutputs } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import { useRouter } from "next/router";
import BillingOverview from "@/components/my-trips/billing/BillingOverview";
import PaymentHistoryOverview from "@/components/my-trips/billing/PaymentHistoryOverview";
import SecurityDepositOverview from "@/components/my-trips/billing/travelerClaims/SecurityDepositOverview";

export type TripCardDetails = RouterOutputs["trips"]["getMyTrips"][number];

interface MyTripsProps {
  billingRoute?: string[]; // Accept billing sub-routes as props
}

export default function MyTrips({ billingRoute }: MyTripsProps) {
  const { data: allTrips } = api.trips.getMyTrips.useQuery();
  const router = useRouter();
  const { tab } = router.query;

  // Adjust selectedTab to consider billingRoute
  const selectedTab = Array.isArray(tab)
    ? tab[0]
    : tab
      ? tab
      : billingRoute
        ? "billing"
        : "upcoming";

  // Determine which trips are upcoming and which are past
  const { upcomingTrips, pastTrips } = useMemo(() => {
    if (!allTrips) return { upcomingTrips: [], pastTrips: [] };
    const now = new Date();
    return {
      upcomingTrips: allTrips.filter((trip) => trip.checkIn > now),
      pastTrips: allTrips.filter((trip) => trip.checkIn <= now),
    };
  }, [allTrips]);

  // Handle tab navigation
  const handleTabClick = (value: string) => {
    void router.push(`/my-trips?tab=${value}`, undefined, { shallow: true });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      <div className="container col-span-10 mx-auto flex max-w-8xl flex-col gap-10 py-10 pb-32 2xl:col-span-11">
        <h1 className="text-4xl font-bold">My Trips</h1>

        <Tabs value={selectedTab} onValueChange={handleTabClick}>
          <TabsList>
            <TabsTrigger value="upcoming">
              <BriefcaseIcon />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="history">
              <HistoryIcon />
              History
            </TabsTrigger>

            {(pastTrips.length > 0 || upcomingTrips.length > 0) && (
              <TabsTrigger value="billing">
                <ReceiptTextIcon />
                Billing
              </TabsTrigger>
            )}
          </TabsList>

          {allTrips === undefined ? (
            <Spinner />
          ) : (
            <>
              <TabsContent value="upcoming">
                <UpcomingTrips upcomingTrips={upcomingTrips} />
              </TabsContent>
              <TabsContent value="history">
                <PastTrips pastTrips={pastTrips} />
              </TabsContent>
              <TabsContent value="billing">
                {/* Render BillingOverview or the specific billing sub-route component */}
                {billingRoute ? (
                  <>
                    {billingRoute[1] === "payment-history" && (
                      <PaymentHistoryOverview />
                    )}
                    {billingRoute[1] === "security-deposits" && (
                      <SecurityDepositOverview />
                    )}
                  </>
                ) : (
                  <BillingOverview />
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
