import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import { OfferPage } from "@/components/propertyPages/PropertyPage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ShareButton from "@/components/_common/ShareLink/ShareButton";
import { type OfferWithDetails } from "@/components/propertyPages/PropertyPage";

import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next";
import { db } from "@/server/db";
import { offers } from "@/server/db/schema/tables/offers";
import { requests } from "@/server/db/schema/tables/requests";
import { and, eq } from "drizzle-orm";

type PageProps = {
  offer: OfferWithDetails;
  serverRequestId: number;
  serverFirstImage: string;
  serverFirstPropertyName: string;
  serverRequestLocation: string;
  baseUrl: string;
};

function Page({
  serverRequestId,
  serverFirstImage,
  serverRequestLocation,
  serverFirstPropertyName,
  baseUrl,
}: PageProps) {
  const router = useRouter();
  const requestId = parseInt(router.query.id as string);
  const [selectedOfferId, setSelectedOfferId] = useState("");

  const { data: offers } = api.offers.getByRequestIdWithProperty.useQuery(
    { id: requestId },
    {
      enabled: router.isReady,
    },
  );

  const [effectHasRun, setEffectHasRun] = useState(false);

  useEffect(() => {
    if (offers?.[0] && !effectHasRun) {
      setEffectHasRun(true);
      setSelectedOfferId(`${offers[0].id}`);
    }
  }, [offers, effectHasRun]);

  if (router.isFallback) {
    return <Spinner />;
  }

  return (
    <DashboardLayout>
      <NextSeo
        title={serverFirstPropertyName}
        description={`Check out your tramona offers in ${serverRequestLocation}`}
        canonical={`${baseUrl}/requests/${serverRequestId}`}
        openGraph={{
          url: `${baseUrl}/requests/${serverRequestId}`,
          type: "website",
          title: serverFirstPropertyName,
          description: `Check out your tramona offers in ${serverRequestLocation}`,
          images: [
            {
              url: serverFirstImage,
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
              type: "image/jpeg",
            },
          ],
          site_name: "Tramona",
        }}
      />
      {offers ? (
        <div className="min-h-screen-minus-header pb-footer-height pt-5 lg:px-4">
          <div className="mx-auto max-w-7xl">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/requests">
                <ChevronLeft className="-mx-1" />
                <div className="font-semibold">Requests</div>
              </Link>
            </Button>
            <div className="px-4 pb-32">
              <Tabs
                defaultValue={`${offers[0]?.id}`}
                value={selectedOfferId}
                onValueChange={setSelectedOfferId}
              >
                <div className="flex items-center justify-between">
                  <TabsList className="w-max">
                    {offers.map((offer, i) => (
                      <TabsTrigger key={offer.id} value={`${offer.id}`}>
                        Offer {i + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ShareButton
                    id={offers[0]!.requestId!}
                    isRequest={true}
                    propertyName={offers[0]!.property.name}
                  />
                </div>
                {offers.map((offer) => (
                  <TabsContent key={offer.id} value={`${offer.id}`}>
                    <OfferPage offer={offer} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const serverRequestId = parseInt(context.query.id as string);
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app"; //change to your live dev server

  const firstPropertyOfRequest = await db.query.offers.findFirst({
    where: and(eq(offers.requestId, serverRequestId)),
    with: {
      property: {},
    },
  });

  const serverFirstImage = firstPropertyOfRequest!.property.imageUrls[0] ?? "";

  const serverFirstPropertyName =
    firstPropertyOfRequest?.property.name ?? "Tramona property";

  const serverRequestLocationResult = await db
    .select({
      location: requests.location,
    })
    .from(requests)
    .where(eq(requests.id, serverRequestId));

  const serverRequestLocation = serverRequestLocationResult[0]?.location ?? "";

  return {
    props: {
      serverRequestLocation,
      serverRequestId,
      serverFirstImage,
      serverFirstPropertyName,
      baseUrl,
    },
  };
};

export default Page;
