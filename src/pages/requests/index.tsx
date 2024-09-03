import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { HistoryIcon, MapPinIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import ActiveRequestsTab from "../../components/requests/CityRequestsTab";
import PastRequestsTab from "../../components/requests/PastRequestsTab";
import { NextSeo } from "next-seo";

function RequestsTabs() {
  return (
    <Tabs defaultValue="activeRequests" className="space-y-4">
      <TabsList>
        <TabsTrigger value="activeRequests">
          <MapPinIcon className="hidden sm:block" />
          Active Requests
        </TabsTrigger>
        <TabsTrigger value="history">
          <HistoryIcon className="hidden sm:block" />
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activeRequests">
        <ActiveRequestsTab />
      </TabsContent>
      <TabsContent value="history">
        <PastRequestsTab />
      </TabsContent>
    </Tabs>
  );
}

export default function Page() {
  useSession({ required: true });
  useMaybeSendUnsentRequests();
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
        <div className="min-h-screen-minus-header px-4 pb-footer-height pt-5">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center">
              <h1 className="flex-1 py-4 text-2xl font-bold tracking-tight text-black lg:text-4xl">
                Requests
              </h1>
            </div>
            <RequestsTabs />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
