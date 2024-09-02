import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import PropertyPage, { OfferPage } from "@/components/offers/PropertyPage";
import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";
import { db } from "@/server/db";
import { offers } from "@/server/db/schema/tables/offers";
import { and, eq } from "drizzle-orm";
import { type OfferWithDetails } from "@/components/offers/PropertyPage";

type PageProps = {
  offer: OfferWithDetails;
  offerId: number;
  firstImage: string;
  baseUrl: string;
};

const Page = ({ offer, firstImage, baseUrl }: PageProps) => {
  const router = useRouter();
  if (router.isFallback) {
    return <Spinner />;
  }

  const metaTitle = offer.property.name
    ? offer.property.name
    : "Check out this offer on Tramona.";

  const metaDescription = "Check out this offer! | Tramona";

  return (
    <DashboadLayout>
      <NextSeo
        title={metaTitle}
        description={metaDescription}
        canonical={`https://www.tramona.com/public-offer/${offer.id}`}
        openGraph={{
          url: `https://www.tramona.com/public-offer/${offer.id}`,
          type: "website",
          title: metaTitle,
          description: metaDescription,
          images: [
            {
              url: `${baseUrl}/api/og?cover=${firstImage}`,
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
              type: "image/jpeg",
            },
          ],
          site_name: "Tramona",
        }}
      />

      <div>
        <div className="py-4">
          <Link
            href="/requests"
            className="rounded-full px-4 py-2 font-medium text-black hover:bg-white/10"
          >
            &larr; Back to all offers
          </Link>
        </div>
        <div className="mx-6 grid grid-cols-1 grid-rows-4 gap-x-6 gap-y-4 pb-32 lg:grid-cols-3">
          <div className="row-span-3 lg:col-span-2">
            <OfferPage offer={offer} />
          </div>
          {offer.property.latitude && offer.property.longitude && (
            <div className="row-span-1 lg:col-span-1 lg:row-span-3">
              <SingleLocationMap
                lat={offer.property.latitude}
                lng={offer.property.longitude}
              />
            </div>
          )}
        </div>
      </div>
    </DashboadLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const offerId = parseInt(context.query.id as string);

  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app/"; //change to your live server

  const offer = await db.query.offers.findFirst({
    where: and(eq(offers.id, offerId)),
    columns: {
      createdAt: true,
      totalPrice: true,
      acceptedAt: true,
      tramonaFee: true,
      checkIn: true,
      checkOut: true,
      id: true,
    },
    with: {
      request: {
        columns: { numGuests: true, location: true, id: true },
      },
      property: {
        with: {
          host: {
            columns: { id: true, name: true, email: true, image: true },
          },
        },
      },
    },
  });

  if (!offer) {
    return {
      notFound: true,
    };
  }

  const firstImage = offer.property.imageUrls[0] ?? "";

  // Convert Date objects to strings
  const serializedOffer = {
    ...offer,
    createdAt: offer.createdAt.toISOString(),
    acceptedAt: offer.acceptedAt ? offer.acceptedAt.toISOString() : null,
    checkIn: offer.checkIn.toISOString(),
    checkOut: offer.checkOut.toISOString(),
    request: offer.request,
    property: {
      ...offer.property,
      createdAt: offer.property.createdAt.toISOString(),
    },
  };

  return {
    props: {
      offer: serializedOffer,
      offerId,
      firstImage,
      baseUrl,
    },
  };
};

export default Page;
