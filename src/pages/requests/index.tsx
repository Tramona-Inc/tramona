import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { HistoryIcon, HomeIcon, MapPinIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CityRequestsTab from "../../components/requests/CityRequestsTab";
import PastRequestsAndOffersTab from "../../components/requests/InactiveRequestGroups";
import PropertyOfferTab from "@/components/requests/PropertyOfferTab";

function RequestsTabs() {
  return (
    <Tabs defaultValue="cityRequests" className="space-y-4">
      <TabsList>
        <TabsTrigger value="cityRequests">
          <MapPinIcon className="hidden sm:block" />
          City Requests
        </TabsTrigger>
        <TabsTrigger value="propertyOffers">
          <HomeIcon className="hidden sm:block" />
          Property Offers
        </TabsTrigger>
        <TabsTrigger value="history">
          <HistoryIcon className="hidden sm:block" />
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="cityRequests">
        <CityRequestsTab />
      </TabsContent>
      <TabsContent value="propertyOffers">
        <PropertyOfferTab />
      </TabsContent>
      <TabsContent value="history">
        <PastRequestsAndOffersTab />
      </TabsContent>
    </Tabs>
  );
}

export default function Page() {
  useSession({ required: true });
  useMaybeSendUnsentRequests();

  return (
    <>
      <Head>
        <title>Requests & Offers | Tramona</title>
      </Head>

      <DashboardLayout type="guest">
        <div className="min-h-screen-minus-header px-4 pb-footer-height pt-5">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center">
              <h1 className="flex-1 py-4 text-2xl font-bold tracking-tight text-black lg:text-4xl">
                Requests & offers
              </h1>
              {/* <NewRequestButton /> */}
            </div>
            <RequestsTabs />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
