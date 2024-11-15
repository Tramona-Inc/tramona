import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import PastTrips from "@/components/my-trips/PastTrips";
import TripsTab from "@/components/my-trips/TripTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, HistoryIcon, ReceiptTextIcon } from "lucide-react";
import { useMemo } from "react";
import { api, type RouterOutputs } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import { useRouter } from "next/router";
import BillingOverview from "@/components/my-trips/billing/BillingOverview";
import PaymentHistoryOverview from "@/components/my-trips/billing/PaymentHistoryOverview";
import SecurityDepositOverview from "@/components/my-trips/billing/travelerClaims/SecurityDepositOverview";
import InnerTravelerLayout from "@/components/_common/Layout/DashboardLayout/InnerTravelerLayout";

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
  const { upcomingTrips, pastTrips, currentTrips } = useMemo(() => {
    if (!allTrips) return { upcomingTrips: [], pastTrips: [], currentTrip: [] };
    const now = new Date();
    return {
      upcomingTrips: allTrips.filter((trip) => trip.checkIn > now),
      currentTrips: allTrips.filter(
        (trip) => trip.checkIn <= now && trip.checkOut > now,
      ),
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
      <InnerTravelerLayout title="My Trips">
        <Tabs
          value={selectedTab}
          onValueChange={handleTabClick}
          className="w-full"
        >
          <TabsList className="">
            {/* tabs list flex-row attributes do not work */}
            <div className="flex w-full flex-row justify-between">
              <div className="flex flex-row flex-nowrap">
                <TabsTrigger value="current">
                  <BriefcaseIcon />
                  Current
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  <BriefcaseIcon />
                  Upcoming
                </TabsTrigger>

                <TabsTrigger value="billing">
                  <ReceiptTextIcon />
                  Billing
                </TabsTrigger>
              </div>
              <div className="w-full border-b-4"></div>
              <TabsTrigger value="history" className="">
                <HistoryIcon />
                History
              </TabsTrigger>
            </div>
          </TabsList>

          {allTrips === undefined ? (
            <Spinner />
          ) : (
            <>
              <TabsContent value="current">
                <TripsTab trips={currentTrips} type="current" />
              </TabsContent>
              <TabsContent value="upcoming">
                <TripsTab trips={upcomingTrips} type="upcoming" />
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
      </InnerTravelerLayout>
    </DashboardLayout>
  );
}
