import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSendUnsentRequest } from "@/utils/useSendUnsentRequests";
import { HistoryIcon, HomeIcon, MapPinIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import ActiveRequestsTab from "../../components/requests/CityRequestsTab";
import PastRequestsTab from "../../components/requests/PastRequestsTab";
import { NextSeo } from "next-seo";
import InnerTravelerLayout from "@/components/_common/Layout/DashboardLayout/InnerTravelerLayout";
import { useRouter } from "next/router";
import BidsTab from "@/components/requests/BidsTab";

function RequestsTabs() {
  const router = useRouter();
  const { tab } = router.query;

  // Handle tab navigation
  const handleTabClick = (value: string) => {
    void router.push(`/requests?tab=${value}`, undefined, { shallow: true });
  };

  const selectedTab = tab ? (tab as string) : "activeRequests";

  return (
    <Tabs
      value={selectedTab}
      onValueChange={handleTabClick}
      className="space-y-4"
    >
      <TabsList>
        <div className="flex w-full flex-row justify-between">
          <TabsTrigger value="activeRequests">
            <MapPinIcon className="hidden sm:block" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="bids">
            <HomeIcon className="hidden sm:block" />
            Bids
          </TabsTrigger>
          <div className="w-full border-b-4" />
          <TabsTrigger value="history">
            <HistoryIcon className="hidden sm:block" />
            History
          </TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="activeRequests">
        <ActiveRequestsTab />
      </TabsContent>
      <TabsContent value="bids">
        <BidsTab />
      </TabsContent>
      <TabsContent value="history">
        <PastRequestsTab />
      </TabsContent>
    </Tabs>
  );
}

export default function Page() {
  useSession({ required: true });
  useSendUnsentRequest();
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app/"; //change to your live server
  return (
    <>
      <NextSeo
        title="Requests | Tramona"
        description="Check out your Tramona requests."
        canonical={`${baseUrl}/requests`}
        openGraph={{
          url: `${baseUrl}/requests`,
          type: "website",
          title: "Requests | Tramona",
          description: "Check out your Tramona requests.",
          images: [
            {
              url: `https://www.tramona.com/assets/images/landing-page/main.png`,
              width: 900,
              height: 800,
              alt: "Tramona",
              type: "image/jpeg",
            },
          ],
          site_name: "Tramona",
        }}
      />
      <DashboardLayout>
        <InnerTravelerLayout title="Requests">
          <RequestsTabs />
        </InnerTravelerLayout>
      </DashboardLayout>
    </>
  );
}
