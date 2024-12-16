import ActivityFeed from "@/components/activity-feed/ActivityFeed";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { NextSeo } from "next-seo";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import CreateRequestDialog from "@/components/activity-feed/admin/RequestDialog";
import CreateOfferDialog from "@/components/activity-feed/admin/OfferDialog";
import CreateBookingDialog from "@/components/activity-feed/admin/BookingDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import Spinner from "@/components/_common/Spinner";

export default function ExclusiveOffersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fillerOnly, setFillerOnly] = useState(false);
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app/"; //change to your live server
  const { data: session } = useSession();

  const isAdmin = session && session.user.role === "admin";

  const autoGeneration = api.feed.generateFillerData.useMutation();
  async function handleAutoGenerate() {
    setIsLoading(true);
    try {
      await autoGeneration.mutateAsync();
    } catch (error) {
      errorToast();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <NextSeo
        title="Recent Deals | Tramona"
        description="Peek at who is getting great deals."
        canonical={`${baseUrl}/activity-feed`}
        openGraph={{
          url: `${baseUrl}/activity-feed`,
          type: "website",
          title: "Feed",
          description: "Peek at who is getting great deals.",
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
        <div className="flex min-h-screen-minus-header items-start justify-center px-4 pb-32 pt-5">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center">
              <h1 className="flex-1 py-4 text-center text-2xl font-semibold tracking-tight text-black lg:text-4xl">
                Recent Deals
              </h1>
            </div>
            {isAdmin && (
              <div className="mb-4 flex flex-col items-start justify-start space-y-2">
                <p className="text-sm font-bold sm:text-base">
                  {" "}
                  Add artificial data:
                </p>
                <div className="flex place-content-start gap-2">
                  <CreateRequestDialog>
                    <Button className="rounded-full">Request</Button>
                  </CreateRequestDialog>
                  <CreateOfferDialog>
                    <Button className="rounded-full">Offer</Button>
                  </CreateOfferDialog>
                  <CreateBookingDialog>
                    <Button className="rounded-full">Booking</Button>
                  </CreateBookingDialog>
                  <Button className="rounded-full" onClick={handleAutoGenerate}>
                    One-Click Generate
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    // defaultChecked={false}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setFillerOnly(true)
                        : setFillerOnly(false);
                    }}
                  />
                  <p className="text-sm font-bold sm:text-base">
                    Show filler only
                  </p>
                </div>
                {isLoading && <Spinner />}
              </div>
            )}
            <ActivityFeed fillerOnly={fillerOnly} />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
