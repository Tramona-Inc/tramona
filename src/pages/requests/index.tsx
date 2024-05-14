import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { HistoryIcon, HomeIcon, MapPinIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ActiveRequestGroups from "../../components/requests/ActiveRequestGroups";
import InactiveRequestGroups from "../../components/requests/InactiveRequestGroups";
import PropertyOfferTab from "@/components/requests/PropertyOfferTab";

// TODO: change to tab links, each with individual fetch
function RequestsTabs() {
  return (
    <Tabs defaultValue="cityRequests" className="space-y-4">
      <TabsList>
        <TabsTrigger value="cityRequests">
          <MapPinIcon />
          City Requests
        </TabsTrigger>
        <TabsTrigger value="propertyOffers">
          <HomeIcon />
          Property Offers
        </TabsTrigger>
        <TabsTrigger value="history">
          <HistoryIcon />
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="cityRequests">
        <ActiveRequestGroups />
      </TabsContent>
      <TabsContent value="propertyOffers">
        <PropertyOfferTab />
      </TabsContent>
      <TabsContent value="history">
        <InactiveRequestGroups />
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
        <div className="min-h-screen-minus-header px-4 pb-64 pt-5">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center">
              <h1 className="flex-1 py-4 text-4xl font-bold text-black">
                Requests & Offers
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
