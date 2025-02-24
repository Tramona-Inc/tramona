import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HostPropertiesRestrictionsTab from "./HostPropertiesRestrictionsTab";
import { Property } from "@/server/db/schema/tables/properties";
import HostFeeTab from "./HostFeeTab";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import PricingTab from "./PricingTab";
interface CalendarSettingsProps {
  property: Property;
  isBookItNowChecked: boolean;
  onPriceLoadingChange: (isLoading: boolean) => void;
}
export default function CalendarSettings({
  property,
  isBookItNowChecked,
  onPriceLoadingChange,
}: CalendarSettingsProps) {
  // const { currentHostTeamId } = useHostTeamStore();

  // <---------------------------------- MUTATIONS ---------------------------------->

  // const { mutateAsync: updateRequestToBook } =
  //   api.properties.updateRequestToBook.useMutation();

  const [bookItNowPercent, setBookItNowPercent] = useState<number>(
    property.bookItNowHostDiscountPercentOffInput,
  );

  // This is used to check if the book it now percent has changed
  const initialBookItNowPercent = useRef<number>(
    property.bookItNowHostDiscountPercentOffInput,
  );

  const router = useRouter();
  const activeTab = (router.query.tab as string) || "pricing";

  // const [biddingOpen, setBiddingOpen] = useState(false);
  // const [biddingSaved, setBiddingSaved] = useState(false);
  const [biddingPercent, setBiddingPercent] = useState<number>(
    property.requestToBookMaxDiscountPercentage,
  );

  console.log("biddingPercent", biddingPercent);


  useEffect(() => {
    setBookItNowPercent(property.bookItNowHostDiscountPercentOffInput);
    setBiddingPercent(property.requestToBookMaxDiscountPercentage);
    initialBookItNowPercent.current =
      property.bookItNowHostDiscountPercentOffInput;
  }, [property]); //update when the selected property changes

  // const handleBiddingSave = async () => {
  //   setBiddingSaved(true);
  //   setTimeout(() => setBiddingSaved(false), 2000);
  //   await updateRequestToBook({
  //     propertyId: property.id,
  //     requestToBookMaxDiscountPercentage: biddingPercent,
  //     currentHostTeamId: currentHostTeamId!,
  //   })
  //     .then(() => {
  //       toast({
  //         title: "Successfully updated book it now percentage!",
  //       });
  //     })
  //     .catch((error) => {
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //       if (error.data?.code === "FORBIDDEN") {
  //         toast({
  //           title:
  //             "You do not have permission to edit overall pricing strategy.",
  //           description: "Please contact your team owner to request access.",
  //         });
  //       } else {
  //         errorToast();
  //       }
  //     });
  // };

  return (
    <Card className="h-full flex-1">
      <CardContent className="p-1 xl:p-3">
        <h2 className="mb-2 text-xl font-bold sm:mb-6 sm:text-2xl">Settings</h2>
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList
            className="mb-4 grid w-full grid-cols-3 sm:mb-6"
            noBorder={true}
          >
            <TabsTrigger
              value="pricing"
              className="flex-1"
              onClick={() => {
                void router.push(
                  {
                    pathname: "/host/calendar",
                    query: { ...router.query, tab: "pricing" },
                  },
                  undefined,
                  { shallow: true },
                );
              }}
            >
              Pricing
            </TabsTrigger>
            <TabsTrigger
              value="fees"
              className="flex-1"
              onClick={() => {
                void router.push(
                  {
                    pathname: "/host/calendar",
                    query: { ...router.query, tab: "fees" },
                  },
                  undefined,
                  { shallow: true },
                );
              }}
            >
              Fees
            </TabsTrigger>
            <TabsTrigger
              value="restrictions"
              className="flex-1"
              onClick={() => {
                void router.push(
                  {
                    pathname: "/host/calendar",
                    query: { ...router.query, tab: "restrictions" },
                  },
                  undefined,
                  { shallow: true },
                );
              }}
            >
              Restrictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-6">
            <PricingTab
              property={property}
              isBookItNowChecked={isBookItNowChecked}
              onPriceLoadingChange={onPriceLoadingChange}
              biddingPercent={biddingPercent}
              setBiddingPercent={setBiddingPercent}
            />
          </TabsContent>
          <TabsContent value="fees" className="space-y-6 sm:space-y-8">
            <HostFeeTab property={property} />
          </TabsContent>
          <TabsContent value="restrictions" className="space-y-6 sm:space-y-8">
            <HostPropertiesRestrictionsTab property={property} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
