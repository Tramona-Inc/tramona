import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import { OfferPage } from "@/components/offers/PropertyPage";
import { NextSeo } from "next-seo";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  getOfferPageData,
  getPropertyForOffer,
} from "@/server/api/routers/offersRouter";
import { OfferWithProperty } from "../../components/requests/[id]/OfferCard/index";
import type { RouterOutputs } from "@/utils/api";

export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];

const Page = ({
  offer,
  firstImage,
  baseUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
        <div className="p-4 pb-64">
          {offer.request && <OfferPage offer={offer} />}
        </div>
      </div>
    </DashboadLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const offerId = parseInt(context.query.id as string);

  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app/"; //change to your live server

  const offerWithoutProperty = await getOfferPageData(offerId);
  const propertyForOffer = await getPropertyForOffer(
    offerWithoutProperty.propertyId,
  );

  const offer: OfferWithDetails = {
    ...offerWithoutProperty,
    property: propertyForOffer,
  };

  console.log(typeof offer);
  console.log(typeof offer);

  return {
    props: {
      offer,
      offerId,
      firstImage: offer.property.imageUrls[0]!,
      baseUrl,
    },
  };
};

export default Page;
