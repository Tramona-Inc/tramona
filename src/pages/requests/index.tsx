import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { HistoryIcon, HomeIcon, MapPinIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ActiveRequestGroups from "../../components/requests/ActiveRequestGroups";
import InactiveRequestGroups from "../../components/requests/InactiveRequestGroups";
import PropertyOfferTab from "@/components/requests/PropertyOfferTab";
import { useMediaQuery } from "@/components/_utils/useMediaQuery";
// TODO: change to tab links, each with individual fetch
function RequestsTabs() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <Tabs defaultValue="cityRequests" className="space-y-4">
      <TabsList>
        <TabsTrigger value="cityRequests">
          {!isMobile && <MapPinIcon />}
          City Requests
        </TabsTrigger>
        <TabsTrigger value="propertyOffers">
          {!isMobile && <HomeIcon />}
          Property Offers
        </TabsTrigger>
        <TabsTrigger value="history">
          {!isMobile && <HistoryIcon />}
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
