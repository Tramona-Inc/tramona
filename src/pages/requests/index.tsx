import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { HistoryIcon, MapPinIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import CityRequestsTab from "../../components/requests/CityRequestsTab";
import PastRequestsAndOffersTab from "../../components/requests/PastRequestsAndOffersTab";
import { NextSeo } from "next-seo";
import { CongratsDialog } from "@/components/landing-page/SearchBars/CongratsDialog";

function RequestsTabs() {
  return (
    <Tabs defaultValue="cityRequests" className="space-y-4">
      <TabsList>
        <TabsTrigger value="cityRequests">
          <MapPinIcon className="hidden sm:block" />
          City Requests
        </TabsTrigger>
        {/* <TabsTrigger value="propertyOffers">
          <HomeIcon className="hidden sm:block" />
          Property Offers
        </TabsTrigger> */}
        <TabsTrigger value="history">
          <HistoryIcon className="hidden sm:block" />
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="cityRequests">
        <CityRequestsTab />
      </TabsContent>
      {/* <TabsContent value="propertyOffers">
        <PropertyOfferTab />
      </TabsContent> */}
      <TabsContent value="history">
        <PastRequestsAndOffersTab />
      </TabsContent>
    </Tabs>
  );
}

export default function Page() {
  useSession({ required: true });
  useMaybeSendUnsentRequests();
  console.log("this should work");
  const openCongratsDialog = localStorage.getItem("showCongratsDialog");
  const location = localStorage.getItem("requestLocation")
  console.log(openCongratsDialog, " ", location)
  // if(openCongratsDialog && location){
  //   <CongratsDialog location={location}/>
  //   // localStorage.removeItem("requestLocation");
  //   // localStorage.removeItem("showCongratsDialog");
  // }
  const isProduction = process.env.NODE_ENV === "production";
  let baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app/"; //change to your live server
  return (
    <>
      <NextSeo
        title="Requests"
        description="Check out your Tramona requests."
        canonical={`${baseUrl}/requests`}
        openGraph={{
          url: `${baseUrl}/requests`,
          type: "website",
          title: "Requests",
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
      <DashboardLayout type="guest">
        {openCongratsDialog && location && <CongratsDialog location={location}/>}
        
        <div className="min-h-screen-minus-header px-4 pb-footer-height pt-5">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center">
              <h1 className="flex-1 py-4 text-2xl font-bold tracking-tight text-black lg:text-4xl">
                Requests
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
